package com.application.cooperfilme.model.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Objects;

@Entity
@Table(name = "tb_votacao")
public class Votacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "roteiro_id", nullable = false)
    private Roteiro roteiro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aprovador_id", nullable = false)
    private Usuario aprovador;

    @Column(nullable = false)
    private Boolean aprovado;

    @Column(length = 1000)
    private String justificativa;

    @Column(nullable = false)
    private LocalDateTime dataVoto = LocalDateTime.now();

    public Votacao() {
    }

    public Votacao(Roteiro roteiro, Usuario aprovador, Boolean aprovado, String justificativa) {
        this.roteiro = roteiro;
        this.aprovador = aprovador;
        this.aprovado = aprovado;
        this.justificativa = justificativa;
        this.dataVoto = LocalDateTime.now();
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Roteiro getRoteiro() {
        return roteiro;
    }

    public void setRoteiro(Roteiro roteiro) {
        this.roteiro = roteiro;
    }

    public Usuario getAprovador() {
        return aprovador;
    }

    public void setAprovador(Usuario aprovador) {
        this.aprovador = aprovador;
    }

    public Boolean getAprovado() {
        return aprovado;
    }

    public void setAprovado(Boolean aprovado) {
        this.aprovado = aprovado;
    }

    public String getJustificativa() {
        return justificativa;
    }

    public void setJustificativa(String justificativa) {
        this.justificativa = justificativa;
    }

    public LocalDateTime getDataVoto() {
        return dataVoto;
    }

    public void setDataVoto(LocalDateTime dataVoto) {
        this.dataVoto = dataVoto;
    }

    @Override
    public boolean equals(Object o) {
        if (o == null || getClass() != o.getClass()) return false;
        Votacao votacao = (Votacao) o;
        return Objects.equals(id, votacao.id);
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    public Long getId() {
        return id;
    }
}
