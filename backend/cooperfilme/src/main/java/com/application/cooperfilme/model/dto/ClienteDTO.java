package com.application.cooperfilme.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record ClienteDTO(

    @NotBlank(message = "Nome é obrigatório")
    @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
    String nome,

    @NotBlank(message = "Email é obrigatório")
    @Size(min = 5, max = 100, message = "Email deve ter entre 5 e 100 caracteres")
    String email,

    @NotBlank(message = "Telefone é obrigatório")
    @Size(min = 7, max = 20, message = "Telefone deve ter entre 7 e 20 caracteres")
    String telefone
) {
}
