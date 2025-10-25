package com.projectNI.api.dto.product;

import com.projectNI.api.model.ProductStatus;
import java.math.BigDecimal;
import java.util.UUID;

public record ProductResponseDTO(
        UUID idProduct,
        String name,
        String category,
        BigDecimal pricePerUnit,
        String description,
        ProductStatus productStatus,
        UUID supplierId,
        String supplierName
) {}