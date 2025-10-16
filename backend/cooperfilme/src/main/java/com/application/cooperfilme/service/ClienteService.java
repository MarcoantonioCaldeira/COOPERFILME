package com.application.cooperfilme.service;

import com.application.cooperfilme.model.dto.ClienteDTO;
import com.application.cooperfilme.model.dto.RoteiroDTO;
import com.application.cooperfilme.model.entity.Cliente;
import com.application.cooperfilme.model.entity.Roteiro;

public interface ClienteService {
    Cliente buscarOuCriarCliente(String nome, String email, String telefone);
    Cliente buscarPorEmail(String email);
}
