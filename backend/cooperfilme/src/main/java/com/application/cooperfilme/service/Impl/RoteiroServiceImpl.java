package com.application.cooperfilme.service.Impl;

import com.application.cooperfilme.enums.StatusRoteiro;
import com.application.cooperfilme.model.dto.AnaliseDTO;
import com.application.cooperfilme.model.dto.RoteiroDTO;
import com.application.cooperfilme.model.dto.VotacaoDTO;
import com.application.cooperfilme.model.entity.Cliente;
import com.application.cooperfilme.model.entity.Roteiro;
import com.application.cooperfilme.model.entity.Usuario;
import com.application.cooperfilme.model.entity.Votacao;
import com.application.cooperfilme.repository.RoteiroRepository;
import com.application.cooperfilme.repository.UsuarioRepository;
import com.application.cooperfilme.repository.VotacaoRepository;
import com.application.cooperfilme.service.ClienteService;
import com.application.cooperfilme.service.RoteiroService;
import com.application.cooperfilme.service.exceptions.PermissaoNegadaException;
import com.application.cooperfilme.service.exceptions.RoteiroNaoEncontradoException;
import com.application.cooperfilme.service.exceptions.UsuarioNaoEncontradoException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoteiroServiceImpl implements RoteiroService {

    @Autowired
    private RoteiroRepository roteiroRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private VotacaoRepository votacaoRepository;

    @Autowired
    private ClienteService clienteService;

    @Override
    @Transactional
    public Roteiro enviarRoteiro(RoteiroDTO roteiroDTO) {
        Cliente cliente = clienteService.buscarOuCriarCliente(
                roteiroDTO.clienteNome(),
                roteiroDTO.clienteEmail(),
                roteiroDTO.clienteTelefones()
        );

        Roteiro roteiro = new Roteiro(
                roteiroDTO.titulo(),
                roteiroDTO.conteudo(),
                cliente
        );

        Roteiro salvo = roteiroRepository.save(roteiro);
        return salvo;
    }


    @Override
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

    @Override
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

    @Override
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

    @Override
    public Roteiro revisarRoteiro(Long roteiroId, Long usuarioId, AnaliseDTO revisaoDTO) {
        Roteiro roteiro = buscarRoteiro(roteiroId);
        Usuario usuario = buscarUsuario(usuarioId);

        if (!roteiro.podeSerRevisadoPor(usuario)) {
            throw new PermissaoNegadaException("Usuário não pode revisar este roteiro");
        }

        roteiro.setObservacoesRevisao(revisaoDTO.justificativa());
        roteiro.setStatus(StatusRoteiro.AGUARDANDO_APROVACAO);

        log.info("Roteiro {} revisado e enviado para aprovação", roteiroId);
        return roteiroRepository.save(roteiro);
    }

    @Override
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
        } else if (roteiro.contarVotosAprovados() >= 3) {
            roteiro.setStatus(StatusRoteiro.APROVADO);
            log.info("Roteiro {} aprovado por votação", roteiroId);
        }

        return roteiroRepository.save(roteiro);
    }

    @Override
    @Transactional
    public List<Roteiro> listarRoteiros(StatusRoteiro status, String emailUsuario) {
        if (status != null && emailUsuario != null) {
            return roteiroRepository.findByStatusAndUsuarioResponsavelEmail(status, emailUsuario);
        } else if (status != null) {
            return roteiroRepository.findByStatus(status);
        } else if (emailUsuario != null) {
            return roteiroRepository.findByUsuarioResponsavelEmail(emailUsuario);
        }
        return roteiroRepository.findAll();
    }

    @Override
    @Transactional
    public Roteiro consultarStatus(Long roteiroId, String emailCliente) {
        return roteiroRepository.findByIdAndClienteEmail(roteiroId, emailCliente)
                .orElseThrow(() -> new RoteiroNaoEncontradoException("Roteiro não encontrado para o cliente informado" + roteiroId));
    }

    @Override
    public Roteiro buscarRoteiro(Long id) {
        return roteiroRepository.findById(id)
                .orElseThrow(() -> new RoteiroNaoEncontradoException("Roteiro não encontrado" + id));
    }

    @Override
    public Usuario buscarUsuario(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new UsuarioNaoEncontradoException("Usuário não encontrado" + id) );
    }
}

