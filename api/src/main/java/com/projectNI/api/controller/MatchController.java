package com.projectNI.api.controller;

import com.projectNI.api.dto.match.MatchResponseDTO;
import com.projectNI.api.service.MatchService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/match")
@RequiredArgsConstructor
public class MatchController {

    private MatchService matchService;

    @Autowired
    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    /**
     * Finds the top 3 matches (products/suppliers) for a specific Bidding.
     * @param biddingId The UUID of the bidding
     * @return A list of the top 3 MatchResponseDTOs (or fewer, if 3 are not found)
     */
    @GetMapping("/{biddingId}")
    public ResponseEntity<List<MatchResponseDTO>> getMatches(@PathVariable UUID biddingId) {
        List<MatchResponseDTO> matches = matchService.findMatches(biddingId);
        return ResponseEntity.ok(matches);
    }
}