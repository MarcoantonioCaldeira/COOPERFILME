package com.application.cooperfilme.service.Impl;

import com.application.cooperfilme.model.dto.ClienteDTO;
import com.application.cooperfilme.model.dto.RoteiroDTO;
import com.application.cooperfilme.model.entity.Cliente;
import com.application.cooperfilme.model.entity.Roteiro;
import com.application.cooperfilme.repository.ClienteRepository;
import com.application.cooperfilme.service.ClienteService;
import org.springframework.beans.factory.annotation.Autowired;

public class ClienteServiceImpl implements ClienteService {

    @Autowired
    ClienteRepository clienteRepository;


    @Override
    public Cliente buscarOuCriarCliente(String nome, String email, String telefone) {
        return clienteRepository.findByEmail(email)
                .orElseGet(() -> {
                    Cliente novoCliente = new Cliente(nome, email, telefone);
                    return clienteRepository.save(novoCliente);
                });
    }

    @Override
    public Cliente buscarPorEmail(String email) {
        return clienteRepository.findByEmail(email).orElse(null);
    }
}
