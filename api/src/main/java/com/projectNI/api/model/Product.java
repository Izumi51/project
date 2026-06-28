package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.Comparator;
import java.util.List;
import java.util.ArrayList;
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

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus productStatus;

    @Column(name = "available_quantity", nullable = false)
    private Integer availableQuantity = 0;

    @Column(name = "unit_logistic_cost", precision = 10, scale = 2)
    private BigDecimal unitLogisticCost;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<PriceTier> priceTiers = new ArrayList<>();

    public BigDecimal getPriceForQuantity(int quantity) {
        if (this.priceTiers == null || this.priceTiers.isEmpty()) {
            return BigDecimal.ZERO;
        }

        return this.priceTiers.stream()
                .filter(tier -> tier.getMinQuantity() <= quantity)
                .max(Comparator.comparing(PriceTier::getMinQuantity))
                .map(PriceTier::getPricePerUnit)
                .orElse(
                        this.priceTiers.stream()
                                .min(Comparator.comparing(PriceTier::getMinQuantity))
                                .map(PriceTier::getPricePerUnit)
                                .orElse(BigDecimal.ZERO)
                );
    }
}