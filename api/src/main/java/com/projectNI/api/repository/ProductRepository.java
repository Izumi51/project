package com.projectNI.api.repository;

import com.projectNI.api.model.Product;
import com.projectNI.api.model.ProductStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ProductRepository extends JpaRepository<Product, UUID> {
    /**
     * Finds products that are for sale (SELLING), match a category,
     * and whose name contains a keyword, ignoring case.
     */
    List<Product> findByCategoryAndProductStatusAndNameContainingIgnoreCase(
            String category,
            ProductStatus status,
            String nameKeyword
    );
}