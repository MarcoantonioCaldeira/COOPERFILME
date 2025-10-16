package com.application.cooperfilme.web.controller;

import com.application.cooperfilme.model.dto.AutenticacaoDTO;
import com.application.cooperfilme.model.dto.LoginDTO;
import com.application.cooperfilme.model.dto.UsuarioDTO;
import com.application.cooperfilme.model.dto.UsuarioRespostaDTO;
import com.application.cooperfilme.model.entity.Usuario;
import com.application.cooperfilme.service.UsuarioService;
import com.application.cooperfilme.web.SystemMessage;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import com.application.cooperfilme.service.security.TokenService;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;

@Controller
@RequestMapping("/usuarios")
@Tag(name = "Usuario", description = "Gerenciamento de usuarios")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenService tokenService;

    @PostMapping(value = "/cadastrar",
            consumes = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE },
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    public  ResponseEntity<Object> criarUsuario(@RequestBody @Valid UsuarioDTO userDTO) {
        Usuario usuarioCriado = usuarioService.salvar(userDTO);
        SystemMessage<Usuario> userMessage = new SystemMessage<>(HttpStatus.OK.value(), "Conexão bem-sucedida! Usuário criado com sucesso.", usuarioCriado);
        return ResponseEntity.ok().body(userMessage);
    }

    @GetMapping(value = "/listar/{id}",
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    public  ResponseEntity<SystemMessage<UsuarioRespostaDTO>> listarPorId(@PathVariable("id") Long id) {
        UsuarioRespostaDTO usuario = usuarioService.pegarPorId(id);
        SystemMessage<UsuarioRespostaDTO> userMessage = new SystemMessage<>(HttpStatus.OK.value(), "Usuário lido com sucesso", usuario);
        return ResponseEntity.ok().body(userMessage);
    }

    @PutMapping(value = "/atualizar/{id}",
            produces = { MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE })
    public  ResponseEntity<?> atualizarUsuario(@PathVariable Long id, @RequestBody UsuarioDTO usuarioDTO) {
        Usuario usuario = usuarioService.atualizar(id, usuarioDTO);
        SystemMessage<Usuario> userMessage = new SystemMessage<>(HttpStatus.OK.value(), "Conexão bem-sucedida! Nota criada com sucesso.", usuario);
        return ResponseEntity.ok().body(userMessage);
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AutenticacaoDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((Usuario) auth.getPrincipal());

        return ResponseEntity.ok(new LoginDTO(token));
    }

    @DeleteMapping(value = "/deletar/{id}")
    public ResponseEntity<?> deletarUsuario(@PathVariable("id") Long id) {
        usuarioService.deletar(id);
        SystemMessage<Usuario> userMessage = new SystemMessage<Usuario>(HttpStatus.OK.value(), "Registro de id: " + id + " deletado com sucesso", null);
        return ResponseEntity.ok().body(userMessage);
    }

}
