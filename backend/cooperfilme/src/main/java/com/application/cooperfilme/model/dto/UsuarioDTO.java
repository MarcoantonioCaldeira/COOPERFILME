package com.application.cooperfilme.model.dto;

import com.application.cooperfilme.enums.Cargo;
import com.application.cooperfilme.model.entity.Usuario;
import com.application.cooperfilme.validation.SenhasIguais;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@SenhasIguais
public record UsuarioDTO(
        @NotBlank(message = "Nome é obrigatório")
        @Size(min = 2, max = 100, message = "Nome deve ter entre 2 e 100 caracteres")
        String nome,

        @NotBlank(message = "Email é obrigatório")
        @Email(message = "Email deve ser válido")
        String email,

        @NotBlank(message = "Senha é obrigatória")
        @Size(min = 6, message = "Senha deve ter no mínimo 6 caracteres")
        String senha,

        @NotBlank(message = "Confirmar Senha é obrigatória")
        String confirmarSenha,

        @NotNull(message = "Cargo é obrigatório")
        Cargo cargo
) {
}