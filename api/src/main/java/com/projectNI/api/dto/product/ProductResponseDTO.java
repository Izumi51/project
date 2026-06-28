package com.projectNI.api.dto.product;

import com.projectNI.api.model.ProductStatus;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductResponseDTO(
        UUID idProduct,
        String name,
        String category,

        Integer availableQuantity,
        BigDecimal unitLogisticCost,

        List<PriceTierDTO> priceTiers,
        String description,
        ProductStatus productStatus,
        UUID supplierId,
        String supplierName
) {
}