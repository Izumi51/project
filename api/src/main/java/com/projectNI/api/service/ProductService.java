package com.projectNI.api.service;

import com.projectNI.api.dto.product.ProductRequestDTO;
import com.projectNI.api.dto.product.ProductResponseDTO;
import com.projectNI.api.dto.product.ProductStatusUpdateDTO;
import com.projectNI.api.dto.product.PriceTierDTO;
import com.projectNI.api.model.PriceTier;
import com.projectNI.api.model.Product;
import com.projectNI.api.model.Supplier;
import com.projectNI.api.repository.ProductRepository;
import com.projectNI.api.repository.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.HashSet;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        // Finds the Supplier
        Supplier supplier = supplierRepository.findById(dto.supplierId())
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with ID: " + dto.supplierId()));

        Product product = new Product();
        product.setName(dto.name());
        product.setCategory(dto.category());
        product.setDescription(dto.description());
        // product.setPricePerUnit(dto.pricePerUnit());
        product.setSupplier(supplier); // Associates the Supplier
        product.setProductStatus(dto.productStatus() != null ? dto.productStatus() : com.projectNI.api.model.ProductStatus.SELLING); // Define um status padrão

        if (dto.priceTiers() != null) {
            Set<PriceTier> tiers = dto.priceTiers().stream()
                    .map(tierDto -> {
                        PriceTier tier = new PriceTier();
                        tier.setProduct(product); // Link the tier to the product
                        tier.setMinQuantity(tierDto.minQuantity());
                        tier.setPricePerUnit(tierDto.pricePerUnit());
                        return tier;
                    })
                    .collect(Collectors.toSet());
            product.setPriceTiers(tiers);
        } else {
            product.setPriceTiers(new HashSet<>()); // Initialize with an empty list if nothing is sent
        }

        Product savedProduct = productRepository.save(product);
        return toResponseDTO(savedProduct);
    }

    @Transactional(readOnly = true)
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProductResponseDTO getProductById(UUID id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));
        return toResponseDTO(product);
    }

    @Transactional
    public ProductResponseDTO updateProduct(UUID id, ProductRequestDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));

        // Finds the new Supplier if the ID changed
        if (!product.getSupplier().getIdSupplier().equals(dto.supplierId())) {
            Supplier supplier = supplierRepository.findById(dto.supplierId())
                    .orElseThrow(() -> new EntityNotFoundException("Supplier not found with ID: " + dto.supplierId()));
            product.setSupplier(supplier);
        }

        product.setName(dto.name());
        product.setCategory(dto.category());
        product.setDescription(dto.description());
        // product.setPricePerUnit(dto.pricePerUnit());
        product.setProductStatus(dto.productStatus());

        // ADD THIS LOGIC (TO UPDATE TIERS)
        // Clear old tiers (thanks to orphanRemoval=true, they will be deleted from the DB)
        product.getPriceTiers().clear();
        if (dto.priceTiers() != null) {
            Set<PriceTier> newTiers = dto.priceTiers().stream()
                    .map(tierDto -> {
                        PriceTier tier = new PriceTier();
                        tier.setProduct(product);
                        tier.setMinQuantity(tierDto.minQuantity());
                        tier.setPricePerUnit(tierDto.pricePerUnit());
                        return tier;
                    })
                    .collect(Collectors.toSet());
            // Add the new tiers
            product.getPriceTiers().addAll(newTiers);
        }

        Product updatedProduct = productRepository.save(product);
        return toResponseDTO(updatedProduct);
    }

    @Transactional
    public void deleteProduct(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with ID: " + id);
        }
        productRepository.deleteById(id);
    }

    @Transactional
    public ProductResponseDTO updateProductStatus(UUID id, ProductStatusUpdateDTO dto) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with ID: " + id));

        product.setProductStatus(dto.status());
        Product updatedProduct = productRepository.save(product);
        return toResponseDTO(updatedProduct);
    }

    // Method to help in convert from Entity to DTO
    private ProductResponseDTO toResponseDTO(Product product) {
        Set<PriceTierDTO> tierDTOs = product.getPriceTiers().stream()
                .map(tier -> new PriceTierDTO(tier.getMinQuantity(), tier.getPricePerUnit()))
                .collect(Collectors.toSet());

        return new ProductResponseDTO(
                product.getIdProduct(),
                product.getName(),
                product.getCategory(),
                // product.getPricePerUnit(),
                tierDTOs,
                product.getDescription(),
                product.getProductStatus(),
                product.getSupplier().getIdSupplier(),
                product.getSupplier().getCompanyName()
        );
    }
}