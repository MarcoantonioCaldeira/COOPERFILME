package com.application.cooperfilme.repository;

import com.application.cooperfilme.enums.StatusRoteiro;
import com.application.cooperfilme.model.entity.Roteiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoteiroRepository extends JpaRepository<Roteiro, Long> {

    @Query("SELECT r FROM Roteiro r JOIN r.cliente c WHERE r.id = :id AND c.email = :email")
    Optional<Roteiro> findByIdAndClienteEmail(Long id, String email);

    @Query("SELECT r FROM Roteiro r JOIN r.usuarioResponsavel u WHERE r.status = :status AND u.email = :email")
    List<Roteiro> findByStatusAndUsuarioResponsavelEmail(StatusRoteiro status, String email);

    @Query("SELECT r FROM Roteiro r WHERE r.status = :status")
    List<Roteiro> findByStatus(StatusRoteiro status);

    @Query("SELECT r FROM Roteiro r JOIN r.usuarioResponsavel u WHERE u.email = :email")
    List<Roteiro> findByUsuarioResponsavelEmail(String email);
}
