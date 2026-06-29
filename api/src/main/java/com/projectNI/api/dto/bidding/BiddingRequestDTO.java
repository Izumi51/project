package com.projectNI.api.dto.bidding;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;

public record BiddingRequestDTO(
        @NotBlank String name,
        @NotBlank String description,
        @NotBlank String productBidding,
        @NotNull @Positive int quantity,
        @NotBlank String category,
        BigDecimal maxDesiredPrice
) {
}