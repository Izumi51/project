package com.projectNI.api.service;

import com.projectNI.api.dto.bidding.BiddingRequestDTO;
import com.projectNI.api.dto.bidding.BiddingResponseDTO;
import com.projectNI.api.dto.bidding.BiddingStatusUpdateDTO;
import com.projectNI.api.model.Bidding;
import com.projectNI.api.model.User;
import com.projectNI.api.repository.BiddingRepository;
import com.projectNI.api.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class BiddingService {

    private final BiddingRepository biddingRepository;
    private final UserRepository userRepository;

    @Autowired
    public BiddingService(BiddingRepository biddingRepository, UserRepository userRepository) {
        this.biddingRepository = biddingRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BiddingResponseDTO createBidding(BiddingRequestDTO dto, UUID userId) {
        // Finds the user who is creating the bidding
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Creates the new Bidding entity
        Bidding bidding = new Bidding();
        bidding.setName(dto.name());
        bidding.setDescription(dto.description());
        bidding.setProductBidding(dto.productBidding());
        bidding.setQuantity(dto.quantity());
        bidding.setCategory(dto.category());
        bidding.setUser(user); // Associates the user with the bidding

        // @PrePersist will handle requestDate and biddingStatus

        Bidding savedBidding = biddingRepository.save(bidding);
        return toResponseDTO(savedBidding);
    }

    @Transactional(readOnly = true)
    public List<BiddingResponseDTO> getAllBiddings() {
        return biddingRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public BiddingResponseDTO getBiddingById(UUID id) {
        Bidding bidding = biddingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bidding not found with ID: " + id));
        return toResponseDTO(bidding);
    }

    @Transactional
    public BiddingResponseDTO updateBidding(UUID id, BiddingRequestDTO dto) {
        Bidding bidding = biddingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bidding not found with ID: " + id));

        // Updates the fields
        bidding.setName(dto.name());
        bidding.setDescription(dto.description());
        bidding.setProductBidding(dto.productBidding());
        bidding.setQuantity(dto.quantity());
        bidding.setCategory(dto.category());

        Bidding updatedBidding = biddingRepository.save(bidding);
        return toResponseDTO(updatedBidding);
    }

    @Transactional
    public void deleteBidding(UUID id) {
        if (!biddingRepository.existsById(id)) {
            throw new EntityNotFoundException("Bidding not found with ID: " + id);
        }
        biddingRepository.deleteById(id);
    }

    @Transactional
    public BiddingResponseDTO updateBiddingStatus(UUID id, BiddingStatusUpdateDTO dto) {
        Bidding bidding = biddingRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Bidding not found with ID: " + id));

        bidding.setBiddingStatus(dto.status());
        Bidding updatedBidding = biddingRepository.save(bidding);
        return toResponseDTO(updatedBidding);
    }

    // Method to help in convert from Entity to DTO
    private BiddingResponseDTO toResponseDTO(Bidding bidding) {
        return new BiddingResponseDTO(
                bidding.getIdBidding(),
                bidding.getName(),
                bidding.getDescription(),
                bidding.getProductBidding(),
                bidding.getQuantity(),
                bidding.getCategory(),
                bidding.getRequestDate(),
                bidding.getBiddingStatus(),
                bidding.getUser().getIdUser(),
                bidding.getUser().getName()
        );
    }
}