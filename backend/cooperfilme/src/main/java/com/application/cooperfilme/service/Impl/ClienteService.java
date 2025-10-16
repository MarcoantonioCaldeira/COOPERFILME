package com.application.cooperfilme.service.Impl;

import com.application.cooperfilme.model.dto.ClienteRespostaDTO;
import com.application.cooperfilme.model.dto.RoteiroRespostaDTO;
import com.application.cooperfilme.model.entity.Cliente;
import com.application.cooperfilme.repository.ClienteRepository;
import com.application.cooperfilme.service.exceptions.ClienteNaoEncontradoException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
public class ClienteService implements com.application.cooperfilme.service.ClienteService {

    @Autowired
    ClienteRepository clienteRepository;

    @Override
    public Cliente buscarPorId(Long id) {
        return clienteRepository.findById(id).orElse(null);
    }

    @Override
    public Cliente buscarOuCriarCliente(String nome, String email, String telefone) {
        return clienteRepository.findByEmail(email)
                .orElseGet(() -> {
                    Cliente novoCliente = new Cliente(nome, email, telefone);
                    return clienteRepository.save(novoCliente);
                });
    }

    @Override
    @Transactional
    public ClienteRespostaDTO buscarPorEmail(String email) {
        Cliente cliente = clienteRepository.findByEmailWithRoteiros(email)
                .orElseThrow(() -> new ClienteNaoEncontradoException(email));

        List<RoteiroRespostaDTO> roteirosDTO = cliente.getRoteiros().stream()
                .map(roteiro -> new RoteiroRespostaDTO(
                        roteiro.getId(),
                        roteiro.getTitulo(),
                        roteiro.getStatus().name(),
                        roteiro.getDataEnvio()
                ))
                .toList();

        return new ClienteRespostaDTO(
                cliente.getId(),
                cliente.getNome(),
                cliente.getEmail(),
                cliente.getTelefone(),
                roteirosDTO
        );
    }

}
