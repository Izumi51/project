package com.projectNI.api.dto.match;

import java.math.BigDecimal;
import java.util.List;

/**
 * Resposta completa do componente MatchService para uma licitação.
 *
 * Consolida:
 *  - allocations: as linhas de alocação por (produto, fornecedor, tier) com
 *    quantidade comprada e custos de aquisição/logística;
 *  - activatedSuppliers: os fornecedores cujo Y_s = 1 na solução, com o
 *    custo fixo cobrado uma única vez por fornecedor;
 *  - os totais agregados, que correspondem aos três blocos de "Visão Geral"
 *    apresentados na interface (MatchDetails / Match).
 */
public record MatchSolutionDTO(
        String solverStatus,           // OPTIMAL, FEASIBLE ou INFEASIBLE
        List<MatchResponseDTO> allocations,
        List<ActivatedSupplierDTO> activatedSuppliers,
        BigDecimal totalItemsCost,     // soma de todos os totalProductCost
        BigDecimal totalLogisticCost,  // soma de todos os totalLogisticCost (frete unitário)
        BigDecimal totalFixedCost,     // soma do fixedCost de cada fornecedor ativado
        BigDecimal grandTotalCost      // totalItemsCost + totalLogisticCost + totalFixedCost
) {
}