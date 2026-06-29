package com.projectNI.api.controller;

import com.projectNI.api.dto.match.MatchSolutionDTO; // 1. Import the wrapper DTO
import com.projectNI.api.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("api/match")
@RequiredArgsConstructor
public class MatchController {

    private final MatchService matchService; // Cleaned up to leverage Lombok's @RequiredArgsConstructor

    /**
     * Finds the optimized solution summary for a specific Bidding.
     * @param biddingId The UUID of the bidding
     * @return The complete optimization solution matrix
     */
    @GetMapping("/{biddingId}")
    public ResponseEntity<MatchSolutionDTO> getMatches(@PathVariable UUID biddingId) {
        // This now matches perfectly with MatchService.findMatches()!
        MatchSolutionDTO solution = matchService.findMatches(biddingId);
        return ResponseEntity.ok(solution);
    }
}