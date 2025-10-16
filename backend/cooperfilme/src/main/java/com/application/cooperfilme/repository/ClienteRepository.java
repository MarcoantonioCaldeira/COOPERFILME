package com.application.cooperfilme.repository;

import com.application.cooperfilme.model.entity.Cliente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    @Query("SELECT c FROM Cliente c LEFT JOIN FETCH c.roteiros WHERE c.email = :email")
    Optional<Cliente> findByEmailWithRoteiros(@Param("email") String email);

    Optional<Cliente> findByEmail(String email);
}
