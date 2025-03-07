package com.anushka.ems_test.service;


import com.anushka.ems_test.CustomUserDetails;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;


@Service
public class JwtService {

    @Value("${app.secret-key}")
    private String secretKey;



    public String generateToken(CustomUserDetails users) {
        Map<String, Object> claims=new HashMap<>();
        String roleUser = users.getAuthorities().stream().map(GrantedAuthority::getAuthority).findFirst().orElse("ROLE_USER");
        claims.put("role",roleUser);


        long expirationTime = 1000 * 60 * 15;

        return Jwts
                .builder()
                .claims(claims)
                .subject(users.getUsername())
                .issuer("AP")
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(generateKey())
                .compact();

    }

    private SecretKey generateKey() {
        byte[] decode = Decoders.BASE64.decode(getSecretKey());
        return Keys.hmacShaKeyFor(decode);
    }

    public String getSecretKey(){
        return secretKey;
    }

    public String extractUserName(String token) {


        return extractClaims(token, Claims::getSubject);
    }

    private<T> T extractClaims(String token, Function<Claims,T> claimsResolver) {
        Claims claims=extractClaims(token);
        return claimsResolver.apply(claims);

    }

    private Claims extractClaims(String token) {
        //verify the token
        //get claims
        //get payload

        return  Jwts
                .parser()
                .verifyWith(generateKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }


    public boolean isTokenValid(String token, UserDetails userDetails) {
        //get claim from token
        //match username
        //check expiration
        final String userName=extractUserName(token);

        return (userName.equals(userDetails.getUsername()) && !isTokenExpired(token) );
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaims(token,Claims::getExpiration);
    }
}

