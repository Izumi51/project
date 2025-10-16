package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

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
}
