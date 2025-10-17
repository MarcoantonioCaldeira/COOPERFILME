package com.application.cooperfilme.service.Impl;

import com.application.cooperfilme.model.dto.RoteiroDTO;
import com.application.cooperfilme.model.entity.Cliente;
import com.application.cooperfilme.model.entity.Roteiro;
import com.application.cooperfilme.repository.RoteiroRepository;
import com.application.cooperfilme.service.ClienteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoteiroCriacaoService {

    private final RoteiroRepository roteiroRepository;
    private final ClienteService clienteService;

    public Roteiro enviarRoteiro(RoteiroDTO roteiroDTO) {
        Cliente cliente = clienteService.buscarOuCriarCliente(
                roteiroDTO.clienteNome(),
                roteiroDTO.clienteEmail(),
                roteiroDTO.telefone()
        );

        Roteiro roteiro = new Roteiro(
                roteiroDTO.titulo(),
                roteiroDTO.conteudo(),
                cliente
        );

        Roteiro salvo = roteiroRepository.save(roteiro);
        return salvo;
    }

    public List<Roteiro> listarRoteiros() {
        var roteiros = roteiroRepository.findAll();
        return roteiros;
    }
}
