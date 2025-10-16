package com.application.cooperfilme.model.dto;

import com.application.cooperfilme.enums.Cargo;

public record UsuarioRespostaDTO(
    Long id,
    String nome,
    String email,
    Cargo cargo
) {
}
