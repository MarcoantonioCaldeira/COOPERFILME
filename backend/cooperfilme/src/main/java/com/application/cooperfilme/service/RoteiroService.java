package com.application.cooperfilme.service;

import com.application.cooperfilme.enums.StatusRoteiro;
import com.application.cooperfilme.model.dto.AnaliseDTO;
import com.application.cooperfilme.model.dto.RoteiroDTO;
import com.application.cooperfilme.model.dto.VotacaoDTO;
import com.application.cooperfilme.model.entity.Roteiro;
import com.application.cooperfilme.model.entity.Usuario;

import java.util.List;

public interface RoteiroService {
    Roteiro enviarRoteiro(RoteiroDTO roteiroDTO);
    Roteiro assumirAnalise(Long roteiroId, Long usuarioId);
    Roteiro analisarRoteiro(Long roteiroId, Long usuarioId, AnaliseDTO analiseDTO);
    Roteiro assumirRevisao(Long roteiroId, Long usuarioId);
    Roteiro revisarRoteiro(Long roteiroId, Long usuarioId, AnaliseDTO revisaoDTO);
    Roteiro votarRoteiro(Long roteiroId, Long usuarioId, VotacaoDTO votoDTO);
    List<Roteiro> listarRoteiros(StatusRoteiro status, String emailUsuario);
    Roteiro consultarStatus(Long roteiroId, String emailCliente);
    Roteiro buscarRoteiro(Long id);
    Usuario buscarUsuario(Long id);
}
