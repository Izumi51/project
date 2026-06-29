package com.projectNI.api.service;

import com.projectNI.api.dto.supplier.SupplierRequestDTO;
import com.projectNI.api.dto.supplier.SupplierResponseDTO;
import com.projectNI.api.dto.supplier.SupplierStatusUpdateDTO;
import com.projectNI.api.model.Supplier;
import com.projectNI.api.model.SupplierStatus;
import com.projectNI.api.repository.SupplierRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    // Inject repository via constructor
    @Autowired
    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // Creates a new Supplier.
    @Transactional
    public SupplierResponseDTO createSupplier(SupplierRequestDTO dto) {
        Supplier supplier = new Supplier();
        supplier.setCompanyName(dto.companyName());
        supplier.setCnpj(dto.cnpj());
        supplier.setContactName(dto.contactName());
        supplier.setPhone(dto.phone());
        supplier.setEmail(dto.email());
        supplier.setSupplierStatus(dto.supplierStatus() != null ? dto.supplierStatus() : SupplierStatus.ACTIVE); // Default status
        supplier.setFixedCost(dto.fixedCost() != null ? dto.fixedCost() : java.math.BigDecimal.ZERO);

        Supplier savedSupplier = supplierRepository.save(supplier);
        return toResponseDTO(savedSupplier);
    }

    // Retrieves all suppliers.
    @Transactional(readOnly = true)
    public List<SupplierResponseDTO> getAllSuppliers() {
        return supplierRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
    }

    // Retrieves a single supplier by its ID.
    @Transactional(readOnly = true)
    public SupplierResponseDTO getSupplierById(UUID id) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with ID: ".concat(id.toString())));
        return toResponseDTO(supplier);
    }

    // Updates an existing supplier.
    @Transactional
    public SupplierResponseDTO updateSupplier(UUID id, SupplierRequestDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with ID: ".concat(id.toString())));

        // Update fields
        supplier.setCompanyName(dto.companyName());
        supplier.setCnpj(dto.cnpj());
        supplier.setContactName(dto.contactName());
        supplier.setPhone(dto.phone());
        supplier.setEmail(dto.email());
        supplier.setSupplierStatus(dto.supplierStatus());
        supplier.setFixedCost(dto.fixedCost() != null ? dto.fixedCost() : java.math.BigDecimal.ZERO);

        Supplier updatedSupplier = supplierRepository.save(supplier);
        return toResponseDTO(updatedSupplier);
    }

    // Deletes a supplier by its ID.
    @Transactional
    public void deleteSupplier(UUID id) {
        if (!supplierRepository.existsById(id)) {
            throw new EntityNotFoundException("Supplier not found with ID: ".concat(id.toString()));
        }
        supplierRepository.deleteById(id);
    }

    // Updates only the status of a supplier.
    @Transactional
    public SupplierResponseDTO updateSupplierStatus(UUID id, SupplierStatusUpdateDTO dto) {
        Supplier supplier = supplierRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Supplier not found with ID: ".concat(id.toString())));

        supplier.setSupplierStatus(dto.status());
        Supplier updatedSupplier = supplierRepository.save(supplier);
        return toResponseDTO(updatedSupplier);
    }

    // Helper method to convert Entity to DTO
    private SupplierResponseDTO toResponseDTO(Supplier supplier) {
        return new SupplierResponseDTO(
                supplier.getIdSupplier(),
                supplier.getCompanyName(),
                supplier.getCnpj(),
                supplier.getContactName(),
                supplier.getPhone(),
                supplier.getEmail(),
                supplier.getSupplierStatus(),
                supplier.getFixedCost()
        );
    }
}