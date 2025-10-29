package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;
import java.util.Comparator;
import java.math.BigDecimal;
import java.util.UUID;

@Table(name="product")
@Entity(name = "product")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idProduct")

public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idProduct;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String category;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idSupplier", nullable = false)
    private Supplier supplier;

//    @Column(nullable = false)
//    private BigDecimal pricePerUnit;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus productStatus;

    /**
     * NEW FIELD:
     * Defines the relationship with price tiers.
     * CascadeType.ALL and orphanRemoval=true ensure that price tiers
     * are saved, updated, and deleted along with the product.
     */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private Set<PriceTier> priceTiers;

    /**
     * HELPER METHOD (CRITICAL):
     * Returns the correct price per unit based on the requested quantity.
     * This is the main logic that MatchService will use.
     */
    public BigDecimal getPriceForQuantity(int quantity) {
        if (this.priceTiers == null || this.priceTiers.isEmpty()) {
            // If there are no tiers, return 0 or throw an exception.
            // It's important to ensure every product has at least one tier (e.g., minQuantity = 1)
            return BigDecimal.ZERO;
        }

        // Find the best price tier.
        // We sort the tiers by minimum quantity (DESCENDING)
        // and take the first tier whose minQuantity is LESS THAN or EQUAL
        // to the quantity the client wants.
        //
        // Ex: Quantity = 500. Tiers: [min=1000, $5], [min=500, $8], [min=1, $10]
        // 1. 1000 <= 500? (No)
        // 2. 500 <= 500? (Yes) -> Returns $8
        //
        // Ex: Quantity = 50. Tiers: [min=1000, $5], [min=500, $8], [min=1, $10]
        // 1. 1000 <= 50? (No)
        // 2. 500 <= 50? (No)
        // 3. 1 <= 50? (Yes) -> Returns $10

        return this.priceTiers.stream()
                .filter(tier -> tier.getMinQuantity() <= quantity)
                .max(Comparator.comparing(PriceTier::getMinQuantity))
                .map(PriceTier::getPricePerUnit)
                .orElse(
                        // Fallback: If no tier is found (e.g., quantity = 0?),
                        // return the price of the lowest tier (minQuantity = 1)
                        this.priceTiers.stream()
                                .min(Comparator.comparing(PriceTier::getMinQuantity))
                                .map(PriceTier::getPricePerUnit)
                                .orElse(BigDecimal.ZERO)
                );
    }
}