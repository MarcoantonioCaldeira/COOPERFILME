package com.application.cooperfilme.model.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RoteiroDTO(

        @NotBlank(message = "Título é obrigatório")
        @Size(min = 2, max = 200, message = "Título deve ter entre 2 e 200 caracteres")
        String titulo,

        @NotBlank(message = "Conteúdo é obrigatório")
        @Size(min = 10, message = "Conteúdo deve ter no mínimo 10 caracteres")
        String conteudo,

        @NotBlank(message = "Nome do cliente é obrigatório")
        String clienteNome,

        @NotBlank(message = "Email do cliente é obrigatório")
        String clienteEmail,

        @NotBlank(message = "Telefone do cliente é obrigatório")
        String clienteTelefones
) {
}
