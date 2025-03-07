package com.anushka.ems_test.service;

import com.anushka.ems_test.CustomUserDetails;
import com.anushka.ems_test.entity.LoginHistory;
import com.anushka.ems_test.entity.Roles;
import com.anushka.ems_test.entity.Users;
import com.anushka.ems_test.exceptions.EmailException;
import com.anushka.ems_test.repository.LoginHistoryRepository;
import com.anushka.ems_test.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthServices {
    @Autowired
    private RefreshTokenService refreshTokenService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
   private LoginHistoryRepository loginHistoryRepository;
    @Autowired
    private NotificationServices notificationServices;
    private final AuthenticationManager authenticationManager;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JwtService jwtService;


    public AuthServices(AuthenticationManager authenticationManager, BCryptPasswordEncoder bCryptPasswordEncoder, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
        this.jwtService = jwtService;
    }


    public Users registerUsers(Users user) {
        Users existingUser = userRepository.findByEmail(user.getEmail());
        if (existingUser != null) {
            throw new EmailException("Email already exists");
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        Roles roles=new Roles();
        roles.setId(3L);
        user.setRoles(roles);
        user.setStatus(false);
        Users savedUser = userRepository.save(user);
        notificationServices.sendApprovalRequest("personal.anushka4401@gmail.com", savedUser.getEmail(), savedUser.getId());

        return savedUser;

    }

//    public String verify(Users user) {
//        Authentication authenticate
//                = authenticationManager.authenticate(
//                new UsernamePasswordAuthenticationToken(
//                        user.getEmail(), user.getPassword()
//                )
//        );
//        Users userLogged = userRepository.findByEmail(user.getEmail());
//        Long userId = userLogged.getId();
//
//        if (authenticate.isAuthenticated()) {
//            LoginHistory loginHistory = new LoginHistory(userId,LocalDateTime.now());
//
//            loginHistoryRepository.save(loginHistory);
//            refreshTokenService.createRefreshToken(user.getEmail());
//
//            return jwtService.generateToken(new CustomUserDetails(userLogged));
//        }
//        return "FAILURE";
//
//    }

    public Map<String, String> verify(Users user) {
        Authentication authenticate = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );
        Users userLogged = userRepository.findByEmail(user.getEmail());
        Long userId = userLogged.getId();


        if (authenticate.isAuthenticated() && userLogged.getStatus()) {
            LoginHistory loginHistory = new LoginHistory(userId, LocalDateTime.now());
            loginHistoryRepository.save(loginHistory);

            String accessToken = jwtService.generateToken(new CustomUserDetails(userLogged));
            String refreshToken = refreshTokenService.createRefreshToken(user.getEmail()).getToken();


            Map<String, String> tokens = new HashMap<>();
            tokens.put("access_token", accessToken);
            tokens.put("refresh_token", refreshToken);

            return tokens;
        }
        throw new RuntimeException("Authentication failed");
    }
    public Users updateProfile(@AuthenticationPrincipal UserDetails userDetails, Users updatedUser) {
        String email = userDetails.getUsername();
        Users userInDb = userRepository.findByEmail(email);

        userInDb.setName(updatedUser.getName());
        userInDb.setEmail(updatedUser.getEmail());
        Users savedUser = userRepository.save(userInDb);
        return savedUser;

    }
}
