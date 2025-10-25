package com.projectNI.api.dto.product;

import com.projectNI.api.model.ProductStatus;
import java.math.BigDecimal;
import java.util.UUID;

public record ProductRequestDTO(
        String name,
        String category,
        UUID supplierId,
        BigDecimal pricePerUnit,
        String description,
        ProductStatus productStatus
) {}