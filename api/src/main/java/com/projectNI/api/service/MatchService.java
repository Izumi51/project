package com.projectNI.api.service;

import com.google.ortools.Loader;
import com.google.ortools.linearsolver.MPConstraint;
import com.google.ortools.linearsolver.MPObjective;
import com.google.ortools.linearsolver.MPSolver;
import com.google.ortools.linearsolver.MPVariable;
import com.projectNI.api.dto.match.ActivatedSupplierDTO;
import com.projectNI.api.dto.match.MatchResponseDTO;
import com.projectNI.api.dto.match.MatchSolutionDTO;
import com.projectNI.api.model.*;
import com.projectNI.api.repository.BiddingRepository;
import com.projectNI.api.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
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
        List<MPVariable> xVars = new ArrayList<>();   // Quantidade comprada em cada Tier
        List<PriceTier> sortedTiers;
    }

    @Transactional(readOnly = true)
    public MatchSolutionDTO findMatches(UUID biddingId) {
        // 1. Busca a solicitação de licitação (demanda)
        Bidding bidding = biddingRepository.findById(biddingId)
                .orElseThrow(() -> new EntityNotFoundException("Bidding not found with ID: " + biddingId));

        int demand = bidding.getQuantity();

        // 2. Busca produtos elegíveis
        List<Product> matchedProducts = productRepository.findByCategoryAndProductStatusAndNameContainingIgnoreCase(
                bidding.getCategory(),
                ProductStatus.VENDENDO,
                bidding.getProductBidding()
        );

        if (matchedProducts.isEmpty()) {
            return emptySolution("INFEASIBLE");
        }

        // 3. Inicializa o Solver Matemático (SCIP - Mixed Integer Programming)
        MPSolver solver = MPSolver.createSolver("SCIP");
        if (solver == null) {
            throw new RuntimeException("Falha ao inicializar o solver SCIP do OR-Tools.");
        }

        double infinity = Double.POSITIVE_INFINITY;

        // Restrição Global: a soma das quantidades compradas de todos os fornecedores
        // deve ser exatamente igual à demanda do edital — Σ X_ps = Demanda_p
        MPConstraint demandConstraint = solver.makeConstraint(demand, demand, "Total_Demand");

        // Objetivo: minimizar o custo total (variável + fixo)
        MPObjective objective = solver.objective();
        objective.setMinimization();

        // Define o limite de preço máximo. Se for null, considera infinito (sem limite).
        double maxAllowedPrice = bidding.getMaxDesiredPrice() != null
                ? bidding.getMaxDesiredPrice().doubleValue()
                : Double.POSITIVE_INFINITY;

        // 4a. Cria a variável binária Y_s (ativação) para cada fornecedor distinto
        // entre os produtos elegíveis, e já incorpora o custo fixo à função objetivo.
        Map<UUID, Supplier> suppliersById = new LinkedHashMap<>();
        for (Product product : matchedProducts) {
            Supplier supplier = product.getSupplier();
            suppliersById.putIfAbsent(supplier.getIdSupplier(), supplier);
        }

        Map<UUID, MPVariable> ySupplierVars = new HashMap<>();
        // Acumula, por fornecedor, todas as variáveis x que dependem da sua ativação,
        // para montar a restrição Big-M agregada (capacidade total do fornecedor na licitação).
        Map<UUID, List<MPVariable>> xVarsBySupplier = new HashMap<>();
        Map<UUID, Integer> capacityBySupplier = new HashMap<>();

        for (Supplier supplier : suppliersById.values()) {
            MPVariable yVar = solver.makeBoolVar("y_supplier_" + supplier.getIdSupplier());
            ySupplierVars.put(supplier.getIdSupplier(), yVar);
            xVarsBySupplier.put(supplier.getIdSupplier(), new ArrayList<>());

            double fixedCost = supplier.getFixedCost() != null ? supplier.getFixedCost().doubleValue() : 0.0;
            objective.setCoefficient(yVar, fixedCost); // Σ CustoFixo_s × Y_s
        }

        List<ProductVars> allProductVars = new ArrayList<>();

        // 4b. Modelagem das variáveis de quantidade por (produto, tier)
        for (int i = 0; i < matchedProducts.size(); i++) {
            Product product = matchedProducts.get(i);
            Supplier supplier = product.getSupplier();
            UUID supplierId = supplier.getIdSupplier();

            if (product.getAvailableQuantity() == null || product.getAvailableQuantity() <= 0) {
                continue;
            }

            ProductVars pVars = new ProductVars();
            pVars.product = product;

            double unitLogisticCost = product.getUnitLogisticCost() != null
                    ? product.getUnitLogisticCost().doubleValue()
                    : 0.0;

            pVars.sortedTiers = product.getPriceTiers().stream()
                    .sorted(Comparator.comparing(PriceTier::getMinQuantity))
                    .collect(Collectors.toList());
            MPConstraint singleTierConstraint = solver.makeConstraint(0, 1, "Single_Tier_Prod_" + i);

            int productCapacity = 0;

            for (int j = 0; j < pVars.sortedTiers.size(); j++) {
                PriceTier tier = pVars.sortedTiers.get(j);

                // Custo real que o solver vai analisar: Preço do Produto + Frete Unitário
                double costCoefficient = tier.getPricePerUnit().doubleValue() + unitLogisticCost;

                // Se o custo desta faixa ultrapassa o orçamento máximo por unidade, ignoramos esta opção
                if (costCoefficient > maxAllowedPrice) {
                    continue;
                }

                int minQty = tier.getMinQuantity();
                int maxQty = Math.min(tier.getMaxQuantity(), product.getAvailableQuantity());

                if (maxQty < minQty) {
                    continue;
                }

                // Variável binária local ao tier: garante a regra "no máximo 1 tier por produto"
                // (não está ligada ao custo fixo — essa responsabilidade é do Y_s do fornecedor).
                MPVariable yTierVar = solver.makeBoolVar("y_prod_" + i + "_tier_" + j);
                singleTierConstraint.setCoefficient(yTierVar, 1);

                MPVariable xVar = solver.makeIntVar(0, maxQty, "x_prod_" + i + "_tier_" + j);
                pVars.xVars.add(xVar);

                demandConstraint.setCoefficient(xVar, 1);
                objective.setCoefficient(xVar, costCoefficient); // Σ Preço_ps × X_ps

                // Liga a quantidade comprada nesta faixa à ativação do tier (mín./máx. do tier)
                MPConstraint minTierConstraint = solver.makeConstraint(0, infinity, "Min_Tier_P" + i + "T" + j);
                minTierConstraint.setCoefficient(xVar, 1);
                minTierConstraint.setCoefficient(yTierVar, -minQty);

                MPConstraint maxTierConstraint = solver.makeConstraint(-infinity, 0, "Max_Tier_P" + i + "T" + j);
                maxTierConstraint.setCoefficient(xVar, 1);
                maxTierConstraint.setCoefficient(yTierVar, -maxQty);

                // Acumula esta variável de quantidade sob o fornecedor responsável,
                // para a restrição Big-M de ativação do fornecedor (Y_s).
                xVarsBySupplier.get(supplierId).add(xVar);
                productCapacity += maxQty;
            }

            capacityBySupplier.merge(supplierId, productCapacity, Integer::sum);

            // Só adiciona o produto à lista matemática se pelo menos uma faixa de preço foi válida
            if (!pVars.xVars.isEmpty()) {
                allProductVars.add(pVars);
            }
        }

        // 4c. Restrição Big-M por fornecedor: X_ps ≤ Capacidade_s × Y_s
        // Um fornecedor só pode fornecer quantidade maior que zero se estiver ativado (Y_s = 1).
        // Caso contrário, todas as variáveis x associadas a ele são forçadas a zero, e o custo
        // fixo (fretes/taxa administrativa) não é incorporado à função objetivo.
        for (Map.Entry<UUID, List<MPVariable>> entry : xVarsBySupplier.entrySet()) {
            UUID supplierId = entry.getKey();
            List<MPVariable> xVars = entry.getValue();
            if (xVars.isEmpty()) {
                continue;
            }

            int bigM = capacityBySupplier.getOrDefault(supplierId, 0);
            if (bigM <= 0) {
                continue;
            }

            MPVariable yVar = ySupplierVars.get(supplierId);
            MPConstraint activationConstraint = solver.makeConstraint(-infinity, 0, "Supplier_Activation_" + supplierId);
            for (MPVariable xVar : xVars) {
                activationConstraint.setCoefficient(xVar, 1);
            }
            activationConstraint.setCoefficient(yVar, -bigM);
        }

        // 5. Executa a resolução do problema
        MPSolver.ResultStatus resultStatus = solver.solve();

        if (resultStatus != MPSolver.ResultStatus.OPTIMAL && resultStatus != MPSolver.ResultStatus.FEASIBLE) {
            // A soma da capacidade de todos os fornecedores cadastrados não é suficiente
            // para atender a quantidade exigida na licitação.
            return emptySolution("INFEASIBLE");
        }

        // 6. Traduz o resultado matemático (linhas de alocação por produto/fornecedor/tier)
        List<MatchResponseDTO> allocations = new ArrayList<>();
        BigDecimal totalItemsCost = BigDecimal.ZERO;
        BigDecimal totalLogisticCost = BigDecimal.ZERO;

        for (ProductVars pVars : allProductVars) {
            for (int j = 0; j < pVars.xVars.size(); j++) {
                int quantityBought = (int) Math.round(pVars.xVars.get(j).solutionValue());

                if (quantityBought > 0) {
                    Product p = pVars.product;
                    PriceTier activeTier = pVars.sortedTiers.get(j);

                    BigDecimal pricePerUnit = activeTier.getPricePerUnit();
                    BigDecimal unitLogistic = p.getUnitLogisticCost() != null ? p.getUnitLogisticCost() : BigDecimal.ZERO;

                    BigDecimal totalProductCost = pricePerUnit.multiply(BigDecimal.valueOf(quantityBought));
                    BigDecimal totalLogistic = unitLogistic.multiply(BigDecimal.valueOf(quantityBought));
                    BigDecimal finalTotalCost = totalProductCost.add(totalLogistic);

                    totalItemsCost = totalItemsCost.add(totalProductCost);
                    totalLogisticCost = totalLogisticCost.add(totalLogistic);

                    allocations.add(new MatchResponseDTO(
                            p.getIdProduct(),
                            p.getName(),
                            p.getSupplier().getIdSupplier(),
                            p.getSupplier().getCompanyName(),
                            pricePerUnit,
                            quantityBought,
                            totalProductCost,
                            unitLogistic,
                            totalLogistic,
                            finalTotalCost
                    ));
                }
            }
        }

        // 7. Traduz os fornecedores efetivamente ativados (Y_s = 1) e seus custos fixos
        List<ActivatedSupplierDTO> activatedSuppliers = new ArrayList<>();
        BigDecimal totalFixedCost = BigDecimal.ZERO;

        for (Map.Entry<UUID, MPVariable> entry : ySupplierVars.entrySet()) {
            boolean isActivated = entry.getValue().solutionValue() > 0.5;
            if (!isActivated) {
                continue;
            }

            Supplier supplier = suppliersById.get(entry.getKey());
            BigDecimal fixedCost = supplier.getFixedCost() != null ? supplier.getFixedCost() : BigDecimal.ZERO;

            totalFixedCost = totalFixedCost.add(fixedCost);
            activatedSuppliers.add(new ActivatedSupplierDTO(
                    supplier.getIdSupplier(),
                    supplier.getCompanyName(),
                    fixedCost
            ));
        }

        BigDecimal grandTotalCost = totalItemsCost.add(totalLogisticCost).add(totalFixedCost);

        // Ordena as alocações do maior pedaço (quem forneceu mais) para o menor
        allocations.sort((a, b) -> Integer.compare(b.quantityBought(), a.quantityBought()));

        return new MatchSolutionDTO(
                resultStatus.name(),
                allocations,
                activatedSuppliers,
                totalItemsCost,
                totalLogisticCost,
                totalFixedCost,
                grandTotalCost
        );
    }

    private MatchSolutionDTO emptySolution(String status) {
        return new MatchSolutionDTO(
                status,
                Collections.emptyList(),
                Collections.emptyList(),
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                BigDecimal.ZERO
        );
    }
}