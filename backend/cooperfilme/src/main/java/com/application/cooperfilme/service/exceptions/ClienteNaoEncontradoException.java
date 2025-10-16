package com.application.cooperfilme.service.exceptions;

public class ClienteNaoEncontradoException extends CooperFilmeException{
    public ClienteNaoEncontradoException(String id) {
        super("Cliente não encontrado: " + id);
    }
}
