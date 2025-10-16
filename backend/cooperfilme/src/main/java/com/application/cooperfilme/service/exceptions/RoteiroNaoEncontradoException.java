package com.application.cooperfilme.service.exceptions;

public class RoteiroNaoEncontradoException extends CooperFilmeException{
    public RoteiroNaoEncontradoException(String id) {
        super("Roteiro não encontrado: " + id);
    }
}
