package com.projectNI.api.service;

import com.projectNI.api.dto.match.MatchResponseDTO;
import com.projectNI.api.model.*;
import com.projectNI.api.repository.BiddingRepository;
import com.projectNI.api.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private final BiddingRepository biddingRepository;
    private final ProductRepository productRepository;

    @Autowired
    public MatchService(BiddingRepository biddingRepository, ProductRepository productRepository) {
        this.biddingRepository = biddingRepository;
        this.productRepository = productRepository;
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> findMatches(UUID biddingId) {
        // 1. Find the Bidding request
        Bidding bidding = biddingRepository.findById(biddingId)
                .orElseThrow(() -> new EntityNotFoundException("Bidding not found with ID: " + biddingId));

        int quantity = bidding.getQuantity();
        String category = bidding.getCategory();
        String productKeyword = bidding.getProductBidding();

        // 2. Search for matching products in the database
        // We use the new repository method to filter only relevant products
        List<Product> matchedProducts = productRepository.findByCategoryAndProductStatusAndNameContainingIgnoreCase(
                category,
                ProductStatus.SELLING, // Only 'SELLING' products
                productKeyword
        );

        // 3. Calculate the total cost for each product and create DTOs
        List<MatchResponseDTO> results = matchedProducts.stream()
                .map(product -> {
                    Supplier supplier = product.getSupplier();
                    BigDecimal totalCost = product.getPricePerUnit().multiply(BigDecimal.valueOf(quantity));

                    return new MatchResponseDTO(
                            product.getIdProduct(),
                            product.getName(),
                            supplier.getIdSupplier(),
                            supplier.getCompanyName(),
                            product.getPricePerUnit(),
                            quantity,
                            totalCost
                    );
                })
                .collect(Collectors.toList());

        // 4. Sort the list by total cost (cheapest first)
        results.sort(Comparator.comparing(MatchResponseDTO::totalCost));

        // 5. Return only the top 3 (the 3 cheapest)
        return results.stream().limit(3).collect(Collectors.toList());
    }
}