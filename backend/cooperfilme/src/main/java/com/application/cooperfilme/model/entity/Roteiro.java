package com.application.cooperfilme.model.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.Lob;
import jakarta.persistence.Enumerated;
import jakarta.persistence.EnumType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToMany;
import jakarta.persistence.CascadeType;
import com.application.cooperfilme.enums.StatusRoteiro;
import com.application.cooperfilme.enums.Cargo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.ToString;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@Table
public class Roteiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String titulo;

    @Lob
    @Column(nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusRoteiro status = StatusRoteiro.AGUARDANDO_ANALISE;

    @Column(nullable = false)
    private LocalDateTime dataEnvio = LocalDateTime.now();

    @Column(length = 1000)
    private String observacoesAnalise;

    @Column(length = 1000)
    private String observacoesRevisao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_responsavel_id")
    private Usuario usuarioResponsavel;

    @OneToMany(mappedBy = "roteiro", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnore
    @ToString.Exclude
    private List<Votacao> votacoes = new ArrayList<>();

    public Roteiro() {
    }


    public Roteiro(String titulo, String conteudo, Cliente cliente) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.cliente = cliente;
        this.status = StatusRoteiro.AGUARDANDO_ANALISE;
        this.dataEnvio = LocalDateTime.now();
    }

    public Roteiro(String titulo, String conteudo, Cliente cliente, Usuario usuarioResponsavel) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.cliente = cliente;
        this.usuarioResponsavel = usuarioResponsavel;
        this.status = StatusRoteiro.AGUARDANDO_ANALISE;
        this.dataEnvio = LocalDateTime.now();
    }

    public boolean podeSerAssumidoPor(Usuario usuario) {
        return (status == StatusRoteiro.AGUARDANDO_ANALISE && usuario.getCargo() == Cargo.ANALISTA) ||
                (status == StatusRoteiro.AGUARDANDO_REVISAO && usuario.getCargo() == Cargo.REVISOR);
    }

    public boolean podeSerAnalisadoPor(Usuario usuario) {
        return status == StatusRoteiro.EM_ANALISE &&
                usuario.getCargo() == Cargo.ANALISTA &&
                usuarioResponsavel != null &&
                usuarioResponsavel.getId().equals(usuario.getId());
    }

    public boolean podeSerRevisadoPor(Usuario usuario) {
        return status == StatusRoteiro.EM_REVISAO &&
                usuario.getCargo() == Cargo.REVISOR &&
                usuarioResponsavel != null &&
                usuarioResponsavel.getId().equals(usuario.getId());
    }

    public boolean podeReceberVotoDe(Usuario usuario) {
        return (status == StatusRoteiro.AGUARDANDO_APROVACAO || status == StatusRoteiro.EM_APROVACAO) &&
                usuario.getCargo() == Cargo.APROVADOR &&
                !jaVotou(usuario);
    }

    private boolean jaVotou(Usuario usuario) {
        return votacoes.stream()
                .anyMatch(votacao -> votacao.getAprovador().getId().equals(usuario.getId()));
    }

    public long contarVotosAprovados() {
        return votacoes.stream().filter(Votacao::getAprovado).count();
    }

    public long contarVotosReprovados() {
        return votacoes.stream().filter(votacao -> !votacao.getAprovado()).count();
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public StatusRoteiro getStatus() {
        return status;
    }

    public void setStatus(StatusRoteiro status) {
        this.status = status;
    }

    public LocalDateTime getDataEnvio() {
        return dataEnvio;
    }

    public void setDataEnvio(LocalDateTime dataEnvio) {
        this.dataEnvio = dataEnvio;
    }

    public String getObservacoesAnalise() {
        return observacoesAnalise;
    }

    public void setObservacoesAnalise(String observacoesAnalise) {
        this.observacoesAnalise = observacoesAnalise;
    }

    public String getObservacoesRevisao() {
        return observacoesRevisao;
    }

    public void setObservacoesRevisao(String observacoesRevisao) {
        this.observacoesRevisao = observacoesRevisao;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Usuario getUsuarioResponsavel() {
        return usuarioResponsavel;
    }

    public void setUsuarioResponsavel(Usuario usuarioResponsavel) {
        this.usuarioResponsavel = usuarioResponsavel;
    }

    public List<Votacao> getVotacoes() {
        return votacoes;
    }

    public void setVotacoes(List<Votacao> votacoes) {
        this.votacoes = votacoes;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Roteiro roteiro = (Roteiro) o;
        return Objects.equals(id, roteiro.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }
}
