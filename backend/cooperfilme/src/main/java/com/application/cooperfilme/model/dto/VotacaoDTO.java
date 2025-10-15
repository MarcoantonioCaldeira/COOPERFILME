package com.application.cooperfilme.model.dto;

import jakarta.validation.constraints.NotBlank;

public record VotacaoDTO(
    boolean aprovado,

    @NotBlank(message = "Justificativa é obrigatória")
    String justificativa
) {
}
