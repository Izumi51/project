package com.projectNI.api.controller;

import com.projectNI.api.dto.supplier.SupplierRequestDTO;
import com.projectNI.api.dto.supplier.SupplierResponseDTO;
import com.projectNI.api.dto.supplier.SupplierStatusUpdateDTO;
import com.projectNI.api.service.SupplierService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("api/supplier")
@RequiredArgsConstructor
public class SupplierController {
    private SupplierService supplierService;

    @Autowired
    SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public ResponseEntity<SupplierResponseDTO> createSupplier(
            @RequestBody SupplierRequestDTO supplierRequestDTO
    ) {

        SupplierResponseDTO createdSupplier;
        createdSupplier = supplierService.createSupplier(supplierRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSupplier);
    }

    @GetMapping
    public ResponseEntity<List<SupplierResponseDTO>> getAllSuppliers() {
        List<SupplierResponseDTO> suppliers = supplierService.getAllSuppliers();
        return ResponseEntity.ok(suppliers);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> getSupplierById(@PathVariable UUID id) {
        SupplierResponseDTO supplier = supplierService.getSupplierById(id);
        return ResponseEntity.ok(supplier);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SupplierResponseDTO> updateSupplier(
            @PathVariable UUID id,
            @RequestBody SupplierRequestDTO supplierRequestDTO) {

        SupplierResponseDTO updatedSupplier;
        updatedSupplier = supplierService.updateSupplier(id, supplierRequestDTO);
        return ResponseEntity.ok(updatedSupplier);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SupplierResponseDTO> updateSupplierStatus(
            @PathVariable UUID id,
            @RequestBody SupplierStatusUpdateDTO supplierStatusUpdateDTO) {

        SupplierResponseDTO updatedSupplierStatus;
        updatedSupplierStatus = supplierService.updateSupplierStatus(id, supplierStatusUpdateDTO);
        return ResponseEntity.ok(updatedSupplierStatus);

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable UUID id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }
}