package com.projectNI.api.dto.match;

import java.math.BigDecimal;
import java.util.UUID;

public record MatchResponseDTO(
        UUID productId,
        String productName,
        UUID supplierId,
        String supplierName,
        BigDecimal pricePerUnit,
        int biddingQuantity,
        BigDecimal totalCost // (pricePerUnit * biddingQuantity)
) {
}
