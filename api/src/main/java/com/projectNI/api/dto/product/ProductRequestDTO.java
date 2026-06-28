package com.projectNI.api.dto.product;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductRequestDTO(
        @NotBlank(message = "O nome do produto é obrigatório")
        String name,

        @NotBlank(message = "A categoria é obrigatória")
        String category,

        @NotNull(message = "O ID do fornecedor é obrigatório")
        UUID idSupplier,

        @NotBlank(message = "A descrição é obrigatória")
        String description,

        @NotNull(message = "A quantidade disponível (estoque) é obrigatória")
        @PositiveOrZero(message = "A quantidade disponível não pode ser negativa")
        Integer availableQuantity,

        @NotNull(message = "O custo logístico unitário é obrigatório")
        @PositiveOrZero(message = "O custo logístico não pode ser negativo")
        BigDecimal unitLogisticCost,

        List<PriceTierDTO> priceTiers
) {
}