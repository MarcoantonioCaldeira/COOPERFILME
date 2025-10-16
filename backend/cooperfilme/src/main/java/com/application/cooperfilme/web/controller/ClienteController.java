package com.application.cooperfilme.web.controller;

import com.application.cooperfilme.model.dto.ClienteRespostaDTO;
import com.application.cooperfilme.service.ClienteService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequestMapping("/clientes")
@Transactional
public class ClienteController {

    @Autowired
    private ClienteService clienteService;


    @Operation(summary = "Buscar cliente por email", description = "Busca um cliente específico pelo email")
    @GetMapping("/email/{email}")
    public ResponseEntity<?> buscarClientePorEmail(@PathVariable String email) {
        log.info("Buscando cliente com email: {}", email);

        ClienteRespostaDTO cliente = clienteService.buscarPorEmail(email);
        return ResponseEntity.ok(cliente);
    }
}
