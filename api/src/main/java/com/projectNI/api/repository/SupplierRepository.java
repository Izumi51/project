package com.projectNI.api.repository;

import com.projectNI.api.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

public interface SupplierRepository extends JpaRepository<Supplier, UUID> {
}