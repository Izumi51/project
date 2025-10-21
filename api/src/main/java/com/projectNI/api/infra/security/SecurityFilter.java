package com.projectNI.api.infra.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.projectNI.api.model.User;
import com.projectNI.api.repository.UserRepository;

import java.io.IOException;
import java.util.Collections;

@Component
public class SecurityFilter extends OncePerRequestFilter {
    @Autowired
    TokenService tokenService;

    @Autowired
    UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        System.out.println("SecurityFilter - Processing request: " + request.getMethod() + " " + request.getRequestURI());
        var token = this.recoverToken(request);

        if (token != null) {
            System.out.println("SecurityFilter - Token found: " + token.substring(0, Math.min(20, token.length())) + "...");
            try {
                var login = tokenService.validateToken(token);
                System.out.println("SecurityFilter - Token validation result: " + login);

                if (login != null) {
                    User user = userRepository.findByEmail(login).orElse(null);
                    System.out.println("SecurityFilter - User found: " + (user != null ? user.getEmail() : "null"));
                    if (user != null) {
                        var authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
                        var authentication = new UsernamePasswordAuthenticationToken(user, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("SecurityFilter - Authentication set for user: " + user.getEmail());
                    } else {
                        System.out.println("SecurityFilter - User not found in database for email: " + login);
                    }
                } else {
                    System.out.println("SecurityFilter - Token validation failed");
                }
            } catch (Exception e) {
                System.err.println("Error validating token: " + e.getMessage());
            }
        } else {
            System.out.println("SecurityFilter - No token found in request");
        }

        filterChain.doFilter(request, response);
    }

    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;
        return authHeader.replace("Bearer ", "");
    }
}

