package com.anushka.ems_test.repository;

import com.anushka.ems_test.entity.RefreshTokens;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshTokens,Long> {
    Optional<RefreshTokens> findByToken(String token);
}
