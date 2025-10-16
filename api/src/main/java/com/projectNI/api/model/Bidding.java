package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.UUID;

@Table(name="bidding_request")
@Entity(name = "bidding_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
public class Bidding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idBidding;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private int quantity;

    @Column
    private String category;

    /**
     * Preço máximo desejado por unidade.
     * Usamos BigDecimal para precisão monetária, evitando erros de arredondamento.
     */
    @Column(name = "max_price_per_unit")
    private BigDecimal maxPricePerUnit;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BiddingStatus biddingStatus;

    /**
     * Relação com os produtos que o sistema encontrou como compatíveis (matches).
     * Uma solicitação pode corresponder a vários produtos.
     * Um produto pode ser a correspondência para várias solicitações diferentes.
     * Esta relação é preenchida pelo seu sistema APÓS a busca ser executada.
     */
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "request_matched_products",
            joinColumns = @JoinColumn(name = "request_id"),
            inverseJoinColumns = @JoinColumn(name = "product_id")
    )
    private Set<Product> matchedProducts;

    @PrePersist
    protected void onCreate() {
        this.requestDate = LocalDateTime.now();
        this.biddingStatus = BiddingStatus.STARTING;
    }
}