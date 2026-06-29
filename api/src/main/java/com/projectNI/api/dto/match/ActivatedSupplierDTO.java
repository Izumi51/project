package com.projectNI.api.dto.match;

import java.math.BigDecimal;
import java.util.UUID;

/**
 * Representa um fornecedor ativado (Y_s = 1) na solução do modelo MILP.
 *
 * O custo fixo (fixedCost) é cobrado uma única vez por fornecedor ativado,
 * independentemente da quantidade ou de quantos produtos diferentes desse
 * fornecedor tenham sido adjudicados — por isso é exposto em um DTO próprio,
 * separado das linhas de alocação por produto (MatchResponseDTO).
 */
public record ActivatedSupplierDTO(
        UUID idSupplier,
        String companyName,
        BigDecimal fixedCost
) {
}