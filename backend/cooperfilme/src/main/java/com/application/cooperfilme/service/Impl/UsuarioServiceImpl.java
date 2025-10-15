package com.application.cooperfilme.service.Impl;

import com.application.cooperfilme.model.dto.UsuarioDTO;
import com.application.cooperfilme.model.entity.Usuario;
import com.application.cooperfilme.repository.UsuarioRepository;
import com.application.cooperfilme.service.UsuarioService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    @Transactional
    public Usuario salvar(UsuarioDTO usuarioDTO) {
        if (usuarioRepository.findByEmail(usuarioDTO.email()).isPresent()) {
            throw new IllegalArgumentException("Login já cadastrado");
        }

        if (!usuarioDTO.senha().equals(usuarioDTO.confirmarSenha())) {
            throw new IllegalArgumentException("Senhas não conferem");
        }

        String senha = new BCryptPasswordEncoder().encode(usuarioDTO.senha());

        var usuario = new Usuario(
                usuarioDTO.nome(),
                usuarioDTO.email(),
                senha,
                usuarioDTO.cargo()
        );

        return usuarioRepository.save(usuario);

    }

    @Override
    public Usuario listar(Long id) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        return usuario;
    }

    @Override
    @Transactional
    public Usuario atualizar(Long id, UsuarioDTO entity) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));

        if (!entity.senha().equals(entity.confirmarSenha())) {
            throw new IllegalArgumentException("Senhas não conferem");
        }

        String senha = new BCryptPasswordEncoder().encode(entity.senha());

        usuario.setNome(entity.nome());
        usuario.setEmail(entity.email());
        usuario.setCampoSenha(senha);
        usuario.setCargo(entity.cargo());

        return usuarioRepository.save(usuario);
    }

    @Override
    public void deletar(Long id) {
        var usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado"));
        usuarioRepository.delete(usuario);
    }
}
