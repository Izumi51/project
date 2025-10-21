package com.projectNI.api.service;

import com.projectNI.api.dto.bidding.BiddingRequestDTO;
import com.projectNI.api.dto.bidding.BiddingResponseDTO;
import com.projectNI.api.dto.bidding.BiddingStatusUpdateDTO;

import java.util.List;
import java.util.UUID;

public class BiddingService {
    public BiddingResponseDTO createBidding(BiddingRequestDTO biddingRequestDTO, UUID userId) {
        return null;
    }

    public List<BiddingResponseDTO> getAllBiddings() {
        return null;
    }

    public BiddingResponseDTO getBiddingById(UUID id) {
        return null;
    }

    public BiddingResponseDTO updateBidding(UUID id, BiddingRequestDTO biddingRequestDTO) {
        return null;
    }

    public void deleteBidding(UUID id) {
    }

    public BiddingResponseDTO updateBiddingStatus(UUID id, BiddingStatusUpdateDTO biddingStateUpdateDTO) {
        return null;
    }
}
