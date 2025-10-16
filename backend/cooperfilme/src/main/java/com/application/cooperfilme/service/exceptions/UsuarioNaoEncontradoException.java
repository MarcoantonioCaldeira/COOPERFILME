package com.application.cooperfilme.service.exceptions;

public class UsuarioNaoEncontradoException extends CooperFilmeException{
    public UsuarioNaoEncontradoException(String id) {
        super("Usuario não encontrado: " + id);
    }
}
