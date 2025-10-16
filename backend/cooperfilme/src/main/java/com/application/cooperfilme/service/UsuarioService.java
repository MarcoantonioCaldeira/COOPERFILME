package com.application.cooperfilme.service;

import com.application.cooperfilme.model.dto.UsuarioDTO;
import com.application.cooperfilme.model.dto.UsuarioRespostaDTO;
import com.application.cooperfilme.model.entity.Usuario;

public interface UsuarioService {
    Usuario salvar(UsuarioDTO usuarioDTO);
    UsuarioRespostaDTO pegarPorId(Long id);
    Usuario atualizar(Long id, UsuarioDTO entity);
    void deletar(Long id);
}
