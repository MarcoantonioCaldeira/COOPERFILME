package com.application.cooperfilme.service.Impl;

import com.application.cooperfilme.enums.StatusRoteiro;
import com.application.cooperfilme.model.dto.AnaliseDTO;
import com.application.cooperfilme.model.dto.RevisaoDTO;
import com.application.cooperfilme.model.dto.RoteiroDTO;
import com.application.cooperfilme.model.dto.VotacaoDTO;
import com.application.cooperfilme.model.entity.Roteiro;
import com.application.cooperfilme.model.entity.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoteiroServiceImpl implements com.application.cooperfilme.service.RoteiroService {

    private final RoteiroCriacaoServiceImpl roteiroCriacaoService;

    private final RoteiroFluxoServiceImpl roteiroFluxoServiceImpl;

    @Override
    @Transactional
    public Roteiro enviarRoteiro(RoteiroDTO roteiroDTO) {
        return roteiroCriacaoService.enviarRoteiro(roteiroDTO);
    }


    @Override
    public Roteiro assumirAnalise(Long roteiroId, Long usuarioId) {
        return roteiroFluxoServiceImpl.assumirAnalise(roteiroId, usuarioId);
    }

    @Override
    public Roteiro analisarRoteiro(Long roteiroId, Long usuarioId, AnaliseDTO analiseDTO) {
       return roteiroFluxoServiceImpl.analisarRoteiro(roteiroId, usuarioId, analiseDTO);
    }

    @Override
    public Roteiro assumirRevisao(Long roteiroId, Long usuarioId) {
        return roteiroFluxoServiceImpl.assumirRevisao(roteiroId, usuarioId);
    }

    @Override
    public Roteiro revisarRoteiro(Long roteiroId, Long usuarioId, RevisaoDTO revisaoDTO) {
       return roteiroFluxoServiceImpl.revisarRoteiro(roteiroId, usuarioId, revisaoDTO);
    }

    @Override
    public Roteiro votarRoteiro(Long roteiroId, Long usuarioId, VotacaoDTO votoDTO) {
       return roteiroFluxoServiceImpl.votarRoteiro(roteiroId, usuarioId, votoDTO);
    }

    @Override
    @Transactional
    public List<Roteiro> listarRoteiros(StatusRoteiro status, String emailUsuario, Date dataEnvio) {
     return roteiroFluxoServiceImpl.listarRoteiros(status, emailUsuario, dataEnvio);
    }

    @Override
    public Roteiro buscarRoteiro(Long id) {
        return roteiroFluxoServiceImpl.buscarRoteiro(id);
    }

    @Override
    public Usuario buscarUsuario(Long id) {
        return roteiroFluxoServiceImpl.buscarUsuario(id);
    }

    @Override
    public List<Roteiro> listarRoteiros() {
        return roteiroCriacaoService.listarRoteiros();
    }
}

