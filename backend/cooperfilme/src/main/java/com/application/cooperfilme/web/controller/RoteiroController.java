package com.application.cooperfilme.web.controller;

import com.application.cooperfilme.enums.StatusRoteiro;
import com.application.cooperfilme.model.dto.AnaliseDTO;
import com.application.cooperfilme.model.dto.RevisaoDTO;
import com.application.cooperfilme.model.dto.RoteiroDTO;
import com.application.cooperfilme.model.dto.VotacaoDTO;
import com.application.cooperfilme.model.entity.Roteiro;
import com.application.cooperfilme.service.RoteiroService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;


import java.util.Date;
import java.util.List;

@Controller
@RequestMapping("/roteiros")
@Slf4j
@Tag(name = "Roteiro", description = "Gerenciamento de roteiros")
public class RoteiroController {

    @Autowired
    private RoteiroService roteiroService;

    @Operation(summary = "Enviar roteiro", description = "Endpoint público para clientes enviarem roteiros")
    @PostMapping("/enviar")
    public ResponseEntity<Roteiro> enviarRoteiro(@RequestBody @Valid RoteiroDTO roteiroDTO) {
        Roteiro roteiro = roteiroService.enviarRoteiro(roteiroDTO);
        return ResponseEntity.ok(roteiro);
    }

    @Operation(summary = "Assumir análise", description = "Analista assume um roteiro para análise")
    @PreAuthorize("hasRole('ANALISTA')")
    @PutMapping("/assumir-analise/{id}/{usuarioId}")
    public ResponseEntity<Roteiro> assumirAnalise(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {
        Roteiro roteiro = roteiroService.assumirAnalise(id, usuarioId);
        return ResponseEntity.ok(roteiro);
    }

    @Operation(summary = "Analisar roteiro", description = "Analista analisa um roteiro e decide se envia para revisão")
    @PreAuthorize("hasRole('ANALISTA')")
    @PutMapping("/analisar/{id}/{usuarioId}")
    public ResponseEntity<Roteiro> analisarRoteiro(
            @PathVariable Long id,
            @PathVariable Long usuarioId,
            @RequestBody @Valid AnaliseDTO analiseDTO) {
        Roteiro roteiro = roteiroService.analisarRoteiro(id, usuarioId, analiseDTO);
        return ResponseEntity.ok(roteiro);
    }

    @Operation(summary = "Assumir revisão", description = "Revisor assume um roteiro para revisão")
    @PreAuthorize("hasRole('REVISOR')")
    @PutMapping("/assumir-revisao/{id}/{usuarioId}")
    public ResponseEntity<Roteiro> assumirRevisao(
            @PathVariable Long id,
            @PathVariable Long usuarioId) {
        Roteiro roteiro = roteiroService.assumirRevisao(id, usuarioId);
        return ResponseEntity.ok(roteiro);
    }

    @Operation(summary = "Revisar roteiro", description = "Revisor revisa um roteiro e envia para aprovação")
    @PreAuthorize("hasRole('REVISOR')")
    @PutMapping("/revisar/{id}/{usuarioId}")
    public ResponseEntity<Roteiro> revisarRoteiro(
            @PathVariable Long id,
            @PathVariable Long usuarioId,
            @RequestBody @Valid RevisaoDTO revisaoDTO) {
        Roteiro roteiro = roteiroService.revisarRoteiro(id, usuarioId, revisaoDTO);
        return ResponseEntity.ok(roteiro);
    }

    @Operation(summary = "Votar no roteiro", description = "Aprovador vota na aprovação ou recusa de um roteiro")
    @PreAuthorize("hasRole('APROVADOR')")
    @PostMapping("/votar/{id}/{usuarioId}")
    public ResponseEntity<Roteiro> votarRoteiro(
            @PathVariable Long id,
            @PathVariable Long usuarioId,
            @RequestBody @Valid VotacaoDTO votoDTO) {
        Roteiro roteiro = roteiroService.votarRoteiro(id, usuarioId, votoDTO);
        return ResponseEntity.ok(roteiro);
    }

    @Operation(summary = "Listar roteiros", description = "Lista roteiros com filtros opcionais por status e usuário")
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<Roteiro>> listarRoteiros(
            @RequestParam(required = false) StatusRoteiro status,
            @RequestParam(required = false) String emailUsuario,
            @RequestParam(required = false) Date dataEnvio) {
        List<Roteiro> roteiros = roteiroService.listarRoteiros(status, emailUsuario, dataEnvio);
        return ResponseEntity.ok(roteiros);
    }

    @Operation(summary = "Buscar roteiro", description = "Busca um roteiro específico por ID")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<Roteiro> buscarRoteiro(@PathVariable Long id) {
        Roteiro roteiro = roteiroService.buscarRoteiro(id);
        return ResponseEntity.ok(roteiro);
    }

    @Operation(summary = "Listar Roteiros", description = "Busca todos os roteiros enviados")
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/listar-todos")
    public ResponseEntity<List<Roteiro>> listarRoteiros() {
        List<Roteiro> roteiros = roteiroService.listarRoteiros();
        return ResponseEntity.ok(roteiros);
    }

}
