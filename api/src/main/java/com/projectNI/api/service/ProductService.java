package com.projectNI.api.service;

import com.projectNI.api.dto.product.ProductRequestDTO;
import com.projectNI.api.dto.product.ProductResponseDTO;
import com.projectNI.api.dto.product.ProductStatusUpdateDTO;

import java.util.List;
import java.util.UUID;

public class ProductService {
    public ProductResponseDTO createProduct(ProductRequestDTO biddingRequestDTO, UUID userId) {
        return null;
    }

    public void deleteProduct(UUID id) {
    }

    public ProductResponseDTO updateProductStatus(UUID id, ProductStatusUpdateDTO biddingStatusUpdateDTO) {
        return null;
    }

    public ProductResponseDTO updateProduct(UUID id, ProductRequestDTO biddingRequestDTO) {
        return null;
    }

    public ProductResponseDTO getProductById(UUID id) {
        return null;
    }

    public List<ProductResponseDTO> getAllProducts() {
        return null;
    }
}
