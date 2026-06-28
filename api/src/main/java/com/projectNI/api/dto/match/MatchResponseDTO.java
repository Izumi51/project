package com.projectNI.api.dto.match;

import java.math.BigDecimal;
import java.util.UUID;

public record MatchResponseDTO(
        UUID idProduct,
        String productName,
        UUID idSupplier,
        String companyName,
        BigDecimal pricePerUnit,
        int quantityBought,
        BigDecimal totalProductCost,      // Custo apenas dos produtos (Preço * Qtd)
        BigDecimal unitLogisticCost,      // Custo logístico unitário
        BigDecimal totalLogisticCost,     // Custo logístico total (Logística * Qtd)
        BigDecimal finalTotalCost         // Custo Final (Produto + Logística)
) {
}