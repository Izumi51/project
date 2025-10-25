package com.projectNI.api.dto.supplier;

import com.projectNI.api.model.SupplierStatus;

public record SupplierRequestDTO(
        String companyName,
        String cnpj,
        String contactName,
        String phone,
        String email,
        SupplierStatus supplierStatus
) {
}