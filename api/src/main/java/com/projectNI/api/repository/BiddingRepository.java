package com.projectNI.api.repository;

import com.projectNI.api.model.Bidding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BiddingRepository extends JpaRepository<Bidding, UUID> {
}