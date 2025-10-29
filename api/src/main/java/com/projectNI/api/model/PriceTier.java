package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.UUID;

@Table(name="price_tier")
@Entity(name = "price_tier")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idPriceTier")
public class PriceTier {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idPriceTier;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idProduct", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer minQuantity; // Ex: 1, 100, 500

    @Column(nullable = false)
    private BigDecimal pricePerUnit; // Price for this tier
}