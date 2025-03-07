package com.anushka.ems_test.controller;

import com.anushka.ems_test.CustomUserDetails;
import com.anushka.ems_test.entity.RefreshTokens;
import com.anushka.ems_test.entity.Users;
import com.anushka.ems_test.repository.UserRepository;
import com.anushka.ems_test.service.AuthServices;
import com.anushka.ems_test.service.JwtService;
import com.anushka.ems_test.service.NotificationServices;
import com.anushka.ems_test.service.RefreshTokenService;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthServices authServices;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private NotificationServices notificationServices;
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private UserRepository userRepository;
    @PostMapping("/register-user")
    public ResponseEntity<Users> registerUser(@RequestBody Users users) throws MessagingException {
        Users savedUser = authServices.registerUsers(users);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);


    }
    @PostMapping("/login-user")
    public ResponseEntity<?> loginUser(@RequestBody Users users){

        Map<String, String> loggedUser = authServices.verify(users);

//        if (loggedUser == null || !loggedUser.containsKey("access_token")) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
//        }

        return ResponseEntity.ok(loggedUser);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refresh_token");
        Optional<RefreshTokens> refreshTokenOpt = refreshTokenService.findByToken(refreshToken);

        if (refreshTokenOpt.isPresent()) {
            RefreshTokens validRefreshToken = refreshTokenService.verifyExpiration(refreshTokenOpt.get());
            Users user = userRepository.findById(validRefreshToken.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));

            String newAccessToken = jwtService.generateToken(new CustomUserDetails(user));

            Map<String, String> tokens = new HashMap<>();
            tokens.put("access_token", newAccessToken);
            tokens.put("refresh_token", validRefreshToken.getToken());

            return ResponseEntity.ok(tokens);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid refresh token");
        }
    }



}
