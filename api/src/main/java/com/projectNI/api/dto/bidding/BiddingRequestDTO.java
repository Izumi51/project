package com.projectNI.api.dto.bidding;

public record BiddingRequestDTO(
    String name,
    String description,
    String productBidding,
    int quantity,
    String category
    // Don't include ID, requestDate or biddingStatus here
) {
}