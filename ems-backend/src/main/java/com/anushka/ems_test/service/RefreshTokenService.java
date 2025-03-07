package com.anushka.ems_test.service;

import com.anushka.ems_test.entity.RefreshTokens;
import com.anushka.ems_test.repository.RefreshTokenRepository;
import com.anushka.ems_test.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RefreshTokenRepository refreshTokenRepository;


    public RefreshTokens createRefreshToken(String userName){
        RefreshTokens refreshTokens=RefreshTokens.builder()
                .userId(userRepository.findByEmail(userName).getId())
                .token(UUID.randomUUID().toString())
                .expiresAt(LocalDateTime.now().plusMinutes(20L))
                .build();
        return refreshTokenRepository.save(refreshTokens);

    }
    public Optional<RefreshTokens> findByToken(String token){
        return refreshTokenRepository.findByToken(token);
    }

    public RefreshTokens verifyExpiration(RefreshTokens token) {
        if(token.getExpiresAt().compareTo(LocalDateTime.now())<0){
            refreshTokenRepository.delete(token);
            throw new RuntimeException(token.getToken() + " Refresh token is expired. Please login again");

        }
        return token;
    }
}
