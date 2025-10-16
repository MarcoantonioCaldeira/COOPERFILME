package com.application.cooperfilme.model.dto;

import java.time.LocalDateTime;

public record RoteiroRespostaDTO(
    Long id,
    String titulo,
    String status,
    LocalDateTime dataEnvio
) {

}
