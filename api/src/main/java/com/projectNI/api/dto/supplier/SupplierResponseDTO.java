package com.projectNI.api.dto.supplier;

import com.projectNI.api.model.SupplierStatus;
import java.math.BigDecimal;
import java.util.UUID;

public record SupplierResponseDTO(
        UUID idSupplier,
        String companyName,
        String cnpj,
        String contactName,
        String phone,
        String email,
        SupplierStatus supplierStatus,
        BigDecimal fixedCost
) {
}