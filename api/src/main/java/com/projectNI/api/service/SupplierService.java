package com.projectNI.api.service;

import com.projectNI.api.dto.supplier.SupplierRequestDTO;
import com.projectNI.api.dto.supplier.SupplierResponseDTO;
import com.projectNI.api.dto.supplier.SupplierStatusUpdateDTO;

import java.util.List;
import java.util.UUID;

public class SupplierService {
    public void deleteSupplier(UUID id) {
    }

    public SupplierResponseDTO updateSupplierStatus(UUID id, SupplierStatusUpdateDTO supplierStatusUpdateDTO) {
        return null;
    }

    public SupplierResponseDTO updateSupplier(UUID id, SupplierRequestDTO supplierRequestDTO) {
        return null;
    }

    public SupplierResponseDTO getSupplierById(UUID id) {
        return null;
    }

    public List<SupplierResponseDTO> getAllSuppliers() {
        return null;
    }

    public SupplierResponseDTO createSupplier(SupplierRequestDTO supplierRequestDTO, UUID userId) {
        return null;
    }
}
