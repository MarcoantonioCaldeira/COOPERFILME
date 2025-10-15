package com.application.cooperfilme.repository;

import com.application.cooperfilme.model.entity.Votacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VotacaoRepository extends JpaRepository<Votacao, Long> {
}
