package com.projectNI.api.service;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;
import com.projectNI.api.dto.match.MatchResponseDTO;
import com.projectNI.api.model.*;
import com.projectNI.api.repository.BiddingRepository;
import com.projectNI.api.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final BiddingRepository biddingRepository;
    private final ProductRepository productRepository;

    // Inicializa as bibliotecas nativas do Google OR-Tools
    static {
        Loader.loadNativeLibraries();
    }

    @Autowired
    public MatchService(BiddingRepository biddingRepository, ProductRepository productRepository) {
        this.biddingRepository = biddingRepository;
        this.productRepository = productRepository;
    }

    // Classe auxiliar para mapear as variáveis matemáticas de cada produto
    private static class ProductVars {
        Product product;
        List<MPVariable> xVars = new ArrayList<>(); // Quantidade comprada em cada Tier
        List<MPVariable> yVars = new ArrayList<>(); // Variável binária: Tier ativado ou não
        List<PriceTier> sortedTiers;
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> findMatches(UUID biddingId) {
        // 1. Busca a solicitação de licitação (demanda)
        Bidding bidding = biddingRepository.findById(biddingId)
                .orElseThrow(() -> new EntityNotFoundException("Bidding not found with ID: " + biddingId));

        int demand = bidding.getQuantity();

        // 2. Busca produtos elegíveis
        List<Product> matchedProducts = productRepository.findByCategoryAndProductStatusAndNameContainingIgnoreCase(
                bidding.getCategory(),
                ProductStatus.SELLING,
                bidding.getProductBidding()
        );

        if (matchedProducts.isEmpty()) {
            return new ArrayList<>();
        }

        // 3. Inicializa o Solver Matemático (SCIP - Mixed Integer Programming)
        MPSolver solver = MPSolver.createSolver("SCIP");
        if (solver == null) {
            throw new RuntimeException("Falha ao inicializar o solver SCIP do OR-Tools.");
        }

        double infinity = java.lang.Double.POSITIVE_INFINITY;

        // Restrição Global: A soma das quantidades compradas de todos os fornecedores DEVE ser igual à demanda
        MPConstraint demandConstraint = solver.makeConstraint(demand, demand, "Total_Demand");

        // Objetivo: Minimizar o custo
        MPObjective objective = solver.objective();
        objective.setMinimization();

        List<ProductVars> allProductVars = new ArrayList<>();

        // 4. Modelagem Matemática
        for (int i = 0; i < matchedProducts.size(); i++) {
            Product product = matchedProducts.get(i);

            // Ignora produtos sem estoque
            if (product.getAvailableQuantity() == null || product.getAvailableQuantity() <= 0) {
                continue;
            }

            ProductVars pVars = new ProductVars();
            pVars.product = product;

            // Define o custo logístico unitário. Se for null no BD, assume 0.
            double unitLogisticCost = product.getUnitLogisticCost() != null
                    ? product.getUnitLogisticCost().doubleValue()
                    : 0.0;

            // Ordena os Tiers do produto (faixas de preço) por quantidade mínima
            pVars.sortedTiers = product.getPriceTiers().stream()
                    .sorted(Comparator.comparing(PriceTier::getMinQuantity))
                    .collect(Collectors.toList());

            // Restrição: Apenas UMA faixa de preço pode ser ativada por produto
            MPConstraint singleTierConstraint = solver.makeConstraint(0, 1, "Single_Tier_Prod_" + i);

            for (int j = 0; j < pVars.sortedTiers.size(); j++) {
                PriceTier tier = pVars.sortedTiers.get(j);

                int minQty = tier.getMinQuantity();

                // O limite máximo da faixa de preço atual é a quantidade mínima da próxima faixa - 1
                int tierUpperLimit = (j < pVars.sortedTiers.size() - 1)
                        ? (pVars.sortedTiers.get(j + 1).getMinQuantity() - 1)
                        : demand;

                // CRÍTICO: O limite máximo real de compra é o menor valor entre o limite da faixa e o estoque disponível
                int maxQty = Math.min(tierUpperLimit, product.getAvailableQuantity());

                // Se o estoque disponível for menor que a exigência mínima do Tier, este Tier não pode ser usado
                if (maxQty < minQty) {
                    continue;
                }

                // Custo real que o solver vai analisar: Preço do Produto + Frete Unitário
                double costCoefficient = tier.getPricePerUnit().doubleValue() + unitLogisticCost;

                // Variável Y (Binária): 1 se vamos usar este Tier, 0 se não
                MPVariable yVar = solver.makeBoolVar("y_prod_" + i + "_tier_" + j);
                pVars.yVars.add(yVar);
                singleTierConstraint.setCoefficient(yVar, 1);

                // Variável X (Inteira): Quantidade comprada neste Tier
                MPVariable xVar = solver.makeIntVar(0, maxQty, "x_prod_" + i + "_tier_" + j);
                pVars.xVars.add(xVar);

                demandConstraint.setCoefficient(xVar, 1); // Adiciona na restrição de demanda total
                objective.setCoefficient(xVar, costCoefficient); // Adiciona na função de minimização de custo

                // Restrições de Lógica do Tier:
                // Se Y = 1, X deve ser >= minQty e <= maxQty
                // Se Y = 0, X deve ser 0

                // X - (minQty * Y) >= 0   =>   X >= minQty * Y
                MPConstraint minConstraint = solver.makeConstraint(0, infinity, "Min_Limit_P" + i + "T" + j);
                minConstraint.setCoefficient(xVar, 1);
                minConstraint.setCoefficient(yVar, -minQty);

                // X - (maxQty * Y) <= 0   =>   X <= maxQty * Y
                MPConstraint maxConstraint = solver.makeConstraint(-infinity, 0, "Max_Limit_P" + i + "T" + j);
                maxConstraint.setCoefficient(xVar, 1);
                maxConstraint.setCoefficient(yVar, -maxQty);
            }

            allProductVars.add(pVars);
        }

        // 5. Executa a resolução do problema
        MPSolver.ResultStatus resultStatus = solver.solve();
        List<MatchResponseDTO> results = new ArrayList<>();

        if (resultStatus == MPSolver.ResultStatus.OPTIMAL || resultStatus == MPSolver.ResultStatus.FEASIBLE) {

            // 6. Traduz o resultado matemático para a resposta do sistema
            for (ProductVars pVars : allProductVars) {
                for (int j = 0; j < pVars.xVars.size(); j++) {
                    int quantityBought = (int) pVars.xVars.get(j).solutionValue();

                    if (quantityBought > 0) { // Se o solver decidiu comprar deste fornecedor nesta faixa
                        Product p = pVars.product;
                        PriceTier activeTier = pVars.sortedTiers.get(j);

                        BigDecimal pricePerUnit = activeTier.getPricePerUnit();
                        BigDecimal unitLogistic = p.getUnitLogisticCost() != null ? p.getUnitLogisticCost() : BigDecimal.ZERO;

                        BigDecimal totalProductCost = pricePerUnit.multiply(BigDecimal.valueOf(quantityBought));
                        BigDecimal totalLogisticCost = unitLogistic.multiply(BigDecimal.valueOf(quantityBought));
                        BigDecimal finalTotalCost = totalProductCost.add(totalLogisticCost);

                        results.add(new MatchResponseDTO(
                                p.getIdProduct(),
                                p.getName(),
                                p.getSupplier().getIdSupplier(),
                                p.getSupplier().getCompanyName(),
                                pricePerUnit,
                                quantityBought,
                                totalProductCost,
                                unitLogistic,
                                totalLogisticCost,
                                finalTotalCost
                        ));
                    }
                }
            }
        } else {
            // Se cair aqui, a soma do estoque de todos os fornecedores cadastrados
            // não é suficiente para atender a quantidade exigida na licitação.
            throw new RuntimeException("Não há estoque suficiente no mercado (entre os fornecedores compatíveis) para suprir a demanda da licitação.");
        }

        // Ordena do maior pedaço (quem forneceu mais) para o menor, ou pelo custo
        results.sort((a, b) -> Integer.compare(b.quantityBought(), a.quantityBought()));
        return results;
    }
}