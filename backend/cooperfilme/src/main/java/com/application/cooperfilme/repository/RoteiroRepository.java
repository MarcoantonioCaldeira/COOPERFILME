package com.application.cooperfilme.repository;

import com.application.cooperfilme.model.entity.Roteiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {
}
