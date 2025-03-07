package com.anushka.ems_test.service;

import com.anushka.ems_test.CustomUserDetails;
import com.anushka.ems_test.entity.Users;
import com.anushka.ems_test.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Objects;


@Component
public class CustomUserDetailsServices implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailsServices(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Users user = userRepository.findByEmail(username);
        if(Objects.isNull(user)){
            throw new UsernameNotFoundException("User not found");
        }
        return new CustomUserDetails(user);

    }
}
