package com.projectNI.api.controller;

import com.projectNI.api.dto.bidding.BiddingRequestDTO;
import com.projectNI.api.dto.bidding.BiddingResponseDTO;
import com.projectNI.api.dto.bidding.BiddingStatusUpdateDTO;
import com.projectNI.api.service.BiddingService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/bidding")
@RequiredArgsConstructor
public class BiddingController {
    private BiddingService biddingService;

    @Autowired
    public BiddingController(BiddingService biddingService) {
        this.biddingService = biddingService;
    }

    @PostMapping
    public ResponseEntity<BiddingResponseDTO> createBidding(
            @RequestBody BiddingRequestDTO biddingRequestDTO,
            @RequestParam(name = "userId", required = false) UUID userId) {

        BiddingResponseDTO createdBidding;
        createdBidding = biddingService.createBidding(biddingRequestDTO, userId);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdBidding);
    }

    @GetMapping
    public ResponseEntity<List<BiddingResponseDTO>> getAllBiddings() {
        List<BiddingResponseDTO> biddings = biddingService.getAllBiddings();
        return ResponseEntity.ok(biddings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<BiddingResponseDTO> getBiddingById(@PathVariable UUID id) {
        BiddingResponseDTO bidding = biddingService.getBiddingById(id);
        return ResponseEntity.ok(bidding);
    }

    @PutMapping("/{id}")
    public ResponseEntity<BiddingResponseDTO> updateBidding(
            @PathVariable UUID id,
            @RequestBody BiddingRequestDTO biddingRequestDTO) {

        BiddingResponseDTO updatedBidding;
        updatedBidding = biddingService.updateBidding(id, biddingRequestDTO);
        return ResponseEntity.ok(updatedBidding);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<BiddingResponseDTO> updateBiddingStatus(
            @PathVariable UUID id,
            @RequestBody BiddingStatusUpdateDTO biddingStatusUpdateDTO) {

        BiddingResponseDTO updatedBiddingStatus;
        updatedBiddingStatus = biddingService.updateBiddingStatus(id, biddingStatusUpdateDTO);
        return ResponseEntity.ok(updatedBiddingStatus);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBidding(@PathVariable UUID id) {
        biddingService.deleteBidding(id);
        return ResponseEntity.noContent().build();
    }
}