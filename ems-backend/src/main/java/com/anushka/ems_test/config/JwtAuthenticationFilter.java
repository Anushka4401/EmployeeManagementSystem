package com.anushka.ems_test.config;

import com.anushka.ems_test.service.JwtService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        final String authHeader=request.getHeader("Authorization");
        if(authHeader==null || !authHeader.startsWith("Bearer ")){

            filterChain.doFilter(request,response);
            return;
        }
        //will get token
        final String jwt=authHeader.substring(7);
        final String userName=jwtService.extractUserName(jwt);

        Authentication authentication= SecurityContextHolder.getContext().getAuthentication();
        if(userName!=null && authentication==null){
            UserDetails userDetails=userDetailsService.loadUserByUsername(userName);
            if(jwtService.isTokenValid(jwt,userDetails)){
                //check if token is valid and pass to usernamepassword token to get token and pass to next filter
//                List<GrantedAuthority> authorities = extractAuthorities(jwt);


                UsernamePasswordAuthenticationToken authenticationToken=
                        new UsernamePasswordAuthenticationToken(userDetails,
                                null, userDetails.getAuthorities());
//                UsernamePasswordAuthenticationToken authenticationToken=
//                        new UsernamePasswordAuthenticationToken(userDetails,
//                                null, authorities);
                authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                //setting session id used by next filter to authenticate request
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);

            }

        }
        filterChain.doFilter(request,response);



    }
//    private List<GrantedAuthority> extractAuthorities(String token) {
//        Claims claims = jwtService.extractClaims(token); // Extract claims from JWT
//        String role = (String) claims.get("role"); // Extract single role (ensure key matches JWT structure)
//
//        if (role == null) {
//            return Collections.emptyList(); // No role found
//        }
//
//        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role)); // Add "ROLE_" prefix if needed
//    }

}