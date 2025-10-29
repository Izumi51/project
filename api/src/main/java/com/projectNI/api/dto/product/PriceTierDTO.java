package com.projectNI.api.dto.product;

import java.math.BigDecimal;

// We use a record for the DTO. We don't need an ID here.
public record PriceTierDTO(
        Integer minQuantity,
        BigDecimal pricePerUnit
) {}