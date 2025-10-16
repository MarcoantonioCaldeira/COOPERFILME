package com.application.cooperfilme.service.Impl;

import com.application.cooperfilme.enums.StatusRoteiro;
import com.application.cooperfilme.model.dto.AnaliseDTO;
import com.application.cooperfilme.model.dto.RevisaoDTO;
import com.application.cooperfilme.model.dto.VotacaoDTO;
import com.application.cooperfilme.model.entity.Roteiro;
import com.application.cooperfilme.model.entity.Usuario;
import com.application.cooperfilme.model.entity.Votacao;
import com.application.cooperfilme.repository.RoteiroRepository;
import com.application.cooperfilme.repository.UsuarioRepository;
import com.application.cooperfilme.repository.VotacaoRepository;
import com.application.cooperfilme.service.exceptions.PermissaoNegadaException;
import com.application.cooperfilme.service.exceptions.RoteiroNaoEncontradoException;
import com.application.cooperfilme.service.exceptions.UsuarioNaoEncontradoException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoteiroFluxoService {

    private final RoteiroRepository roteiroRepository;
    private final UsuarioRepository usuarioRepository;
    private final VotacaoRepository votacaoRepository;

    public Roteiro assumirAnalise(Long roteiroId, Long usuarioId) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        Usuario usuario = buscarUsuario(usuarioId);

        if (!roteiro.podeSerAssumidoPor(usuario)) {
            throw new PermissaoNegadaException("Usuário não pode assumir este roteiro para análise");
        }

        roteiro.setUsuarioResponsavel(usuario);
        roteiro.setStatus(StatusRoteiro.EM_ANALISE);

        Roteiro save =  roteiroRepository.save(roteiro);
        return save;
    }

    public Roteiro analisarRoteiro(Long roteiroId, Long usuarioId, AnaliseDTO analiseDTO) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        Usuario usuario = buscarUsuario(usuarioId);

        if (!roteiro.podeSerAnalisadoPor(usuario)) {
            throw new PermissaoNegadaException("Usuário não pode analisar este roteiro");
        }

        roteiro.setObservacoesAnalise(analiseDTO.justificativa());

        if (analiseDTO.apto()) {
            roteiro.setStatus(StatusRoteiro.AGUARDANDO_REVISAO);
            log.info("Roteiro {} aprovado para revisão", roteiroId);
        } else {
            roteiro.setStatus(StatusRoteiro.RECUSADO);
            log.info("Roteiro {} recusado na análise", roteiroId);
        }

        return roteiroRepository.save(roteiro);
    }

    public Roteiro assumirRevisao(Long roteiroId, Long usuarioId) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        Usuario usuario = buscarUsuario(usuarioId);

        if (!roteiro.podeSerAssumidoPor(usuario)) {
            throw new PermissaoNegadaException("Usuário não pode assumir este roteiro para revisão");
        }

        roteiro.setUsuarioResponsavel(usuario);
        roteiro.setStatus(StatusRoteiro.EM_REVISAO);

        log.info("Roteiro {} assumido por revisor {}", roteiroId, usuarioId);
        return roteiroRepository.save(roteiro);
    }

    public Roteiro revisarRoteiro(Long roteiroId, Long usuarioId, RevisaoDTO revisaoDTO) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        Usuario usuario = buscarUsuario(usuarioId);

        if (!roteiro.podeSerRevisadoPor(usuario)) {
            throw new PermissaoNegadaException("Usuário não pode revisar este roteiro");
        }

        roteiro.setObservacoesRevisao(revisaoDTO.observacoes());
        roteiro.setStatus(StatusRoteiro.AGUARDANDO_APROVACAO);

        log.info("Roteiro {} revisado e enviado para aprovação", roteiroId);
        return roteiroRepository.save(roteiro);
    }

    public Roteiro votarRoteiro(Long roteiroId, Long usuarioId, VotacaoDTO votoDTO) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        Usuario usuario = buscarUsuario(usuarioId);

        if (!roteiro.podeReceberVotoDe(usuario)) {
            throw new PermissaoNegadaException("Usuário não pode votar neste roteiro");
        }


        Votacao votacao = new Votacao(roteiro, usuario, votoDTO.aprovado(), votoDTO.justificativa());
        votacaoRepository.save(votacao);

        if (roteiro.getStatus() == StatusRoteiro.AGUARDANDO_APROVACAO) {
            roteiro.setStatus(StatusRoteiro.EM_APROVACAO);
        }

        if (roteiro.contarVotosReprovados() > 0) {
            roteiro.setStatus(StatusRoteiro.RECUSADO);
            log.info("Roteiro {} recusado por votação", roteiroId);
        } else if (roteiro.contarVotosAprovados() >= 2) {
            roteiro.setStatus(StatusRoteiro.APROVADO);
            log.info("Roteiro {} aprovado por votação", roteiroId);
        }

        return roteiroRepository.save(roteiro);
    }

    @Transactional
    public List<Roteiro> listarRoteiros(StatusRoteiro status, String emailUsuario, Date dataEnvio) {
        if (status != null && emailUsuario != null && dataEnvio != null) {
            return roteiroRepository.findByStatusAndUsuarioResponsavelEmail(status, emailUsuario, dataEnvio);
        } else if (status != null) {
            return roteiroRepository.findByStatus(status);
        } else if (emailUsuario != null) {
            return roteiroRepository.findByUsuarioResponsavelEmail(emailUsuario);
        }
        return roteiroRepository.findAll();
    }

    public Roteiro buscarRoteiro(Long id) {
        return roteiroRepository.findById(id)
                .orElseThrow(() -> new RoteiroNaoEncontradoException("Roteiro não encontrado" + id));
    }

    public Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado" + id) );
    }
}
