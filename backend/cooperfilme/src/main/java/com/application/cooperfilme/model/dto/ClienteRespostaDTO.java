package com.application.cooperfilme.model.dto;

import java.util.List;

public record ClienteRespostaDTO(
        Long id,
        String nome,
        String email,
        String telefone,
        List<RoteiroRespostaDTO> roteiros
) {
}
