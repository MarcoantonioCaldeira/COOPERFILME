package com.application.cooperfilme.model.dto;

import jakarta.validation.constraints.NotBlank;

public record AnaliseDTO(
    @NotBlank(message = "Justificativa é obrigatória")
    String justificativa,

    boolean apto
) {
}
