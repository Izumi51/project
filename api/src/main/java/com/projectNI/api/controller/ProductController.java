package com.projectNI.api.controller;

import com.projectNI.api.dto.product.ProductRequestDTO;
import com.projectNI.api.dto.product.ProductResponseDTO;
import com.projectNI.api.dto.product.ProductStatusUpdateDTO;
import com.projectNI.api.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/product")
@RequiredArgsConstructor
public class ProductController {
    private ProductService productService;

    @Autowired ProductController(ProductService productService) {
        this.productService = productService;
    }

    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(
            @RequestBody ProductRequestDTO productRequestDTO,
            @RequestParam(name = "userId", required = false) UUID userId) {

        ProductResponseDTO createdProduct;
        createdProduct = productService.createProduct(productRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdProduct);
    }

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts();
        return ResponseEntity.ok(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable UUID id) {
        ProductResponseDTO product = productService.getProductById(id);
        return ResponseEntity.ok(product);
    }

    @PostMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(
            @PathVariable UUID id,
            @RequestBody ProductRequestDTO productRequestDTO) {

        ProductResponseDTO updatedProduct;
        updatedProduct = productService.updateProduct(id, productRequestDTO);
        return ResponseEntity.ok(updatedProduct);
    }

    @PostMapping("/{id}/status")
    public ResponseEntity<ProductResponseDTO> updateProductStatus(
            @PathVariable UUID id,
            @RequestBody ProductStatusUpdateDTO productStatusUpdateDTO) {

        ProductResponseDTO updatedProductStatus;
        updatedProductStatus = productService.updateProductStatus(id, productStatusUpdateDTO);
        return ResponseEntity.ok(updatedProductStatus);

    }

    @PostMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}