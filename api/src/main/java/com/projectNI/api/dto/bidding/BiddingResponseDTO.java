package com.projectNI.api.dto.bidding;

import com.projectNI.api.model.BiddingStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

public record BiddingResponseDTO(
        UUID idBidding,
        String name,
        String description,
        String productBidding,
        int quantity,
        String category,
        BigDecimal maxDesiredPrice,
        LocalDateTime requestDate,
        BiddingStatus biddingStatus,
        UUID userId,
        String userName
) {
}