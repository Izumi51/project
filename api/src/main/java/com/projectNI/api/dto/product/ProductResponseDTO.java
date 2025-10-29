package com.projectNI.api.dto.product;

import com.projectNI.api.model.ProductStatus;
import java.util.List;
import java.util.UUID;

public record ProductResponseDTO(
        UUID idProduct,
        String name,
        String category,
        // BigDecimal pricePerUnit,
        List<PriceTierDTO> priceTiers,
        String description,
        ProductStatus productStatus,
        UUID supplierId,
        String supplierName
) {
}