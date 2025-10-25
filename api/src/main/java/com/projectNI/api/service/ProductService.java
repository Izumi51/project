package com.projectNI.api.service;

import com.projectNI.api.dto.product.ProductRequestDTO;
import com.projectNI.api.dto.product.ProductResponseDTO;
import com.projectNI.api.dto.product.ProductStatusUpdateDTO;
import com.projectNI.api.model.Product;
import com.projectNI.api.model.Supplier;
import com.projectNI.api.repository.ProductRepository;
import com.projectNI.api.repository.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @Autowired
    public ProductService(ProductRepository productRepository, SupplierRepository supplierRepository) {
        this.productRepository = productRepository;
        this.supplierRepository = supplierRepository;
    }

    /*
     * Note que mudei a assinatura. O controlador passava "userId",
     * mas a entidade Product precisa de um "supplierId", que estou pegando do DTO.
     * Você precisará ajustar seu `ProductController` para não passar o `userId`
     * e garantir que o `supplierId` venha no `ProductRequestDTO`.
     */
    @Transactional
    public ProductResponseDTO createProduct(ProductRequestDTO dto) {
        // Finds the Supplier
        Supplier supplier = supplierRepository.findById(dto.supplierId())
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with ID: " + dto.supplierId()));

        Product product = new Product();
        product.setName(dto.name());
        product.setCategory(dto.category());
        product.setDescription(dto.description());
        product.setPricePerUnit(dto.pricePerUnit());
        product.setSupplier(supplier); // Associates the Supplier
        product.setProductStatus(dto.productStatus() != null ? dto.productStatus() : com.projectNI.api.model.ProductStatus.SELLING); // Define um status padrão

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
        product.setPricePerUnit(dto.pricePerUnit());
        product.setProductStatus(dto.productStatus());

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
        return new ProductResponseDTO(
                product.getIdProduct(),
                product.getName(),
                product.getCategory(),
                product.getPricePerUnit(),
                product.getDescription(),
                product.getProductStatus(),
                product.getSupplier().getIdSupplier(),
                product.getSupplier().getCompanyName()
        );
    }
}