package com.application.cooperfilme.service;

import com.application.cooperfilme.model.dto.ClienteRespostaDTO;
import com.application.cooperfilme.model.entity.Cliente;

public interface ClienteService {
    Cliente buscarPorId(Long id);
    Cliente buscarOuCriarCliente(String nome, String email, String telefone);
    ClienteRespostaDTO buscarPorEmail(String email);
}
