package com.projectNI.api.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Table(name="bidding_request")
@Entity(name = "bidding_request")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "idBidding")
public class Bidding {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID idBidding;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String productBidding;

    @Column(nullable = false)
    private int quantity;

    @Column
    private String category;

    @Column(nullable = true)
    private BigDecimal maxDesiredPrice;

    @Column(nullable = false)
    private LocalDateTime requestDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BiddingStatus biddingStatus;

    @PrePersist
    protected void onCreate() {
        this.requestDate = LocalDateTime.now();
        this.biddingStatus = BiddingStatus.ABERTO;
    }
}