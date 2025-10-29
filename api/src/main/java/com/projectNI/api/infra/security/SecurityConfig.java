package com.projectNI.api.infra.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Autowired
    SecurityFilter securityFilter;

    @Autowired
    CorsConfigurationSource corsConfigurationSource;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Auth endpoints - Permitted for everyone
                        .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                        // Keep these commented out in controller, in case you enable them later
//                        .requestMatchers(HttpMethod.POST, "/api/auth/otp/request").permitAll()
//                        .requestMatchers(HttpMethod.POST, "/api/auth/otp/verify").permitAll()
//                        .requestMatchers(HttpMethod.POST, "/api/auth/password/reset").permitAll()
                        // --- Product Endpoints ---
                        // Allow reading products without authentication
                        .requestMatchers(HttpMethod.GET, "/api/product").permitAll() // Corrected path
                        .requestMatchers(HttpMethod.GET, "/api/product/{id}").permitAll() // Corrected path
                        // Require authentication for modifying products
                        .requestMatchers(HttpMethod.POST, "/api/product").authenticated() // Corrected path
                        .requestMatchers(HttpMethod.PUT, "/api/product/{id}").authenticated() // Corrected path pattern
                        .requestMatchers(HttpMethod.PUT, "/api/product/{id}/status").authenticated() // Corrected path pattern
                        .requestMatchers(HttpMethod.DELETE, "/api/product/{id}").authenticated() // Corrected path pattern
                        // --- Bidding Endpoints ---
                        // Example: Allow reading biddings publicly, require auth for changes
                        .requestMatchers(HttpMethod.GET, "/api/bidding").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/bidding/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/bidding").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/bidding/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/bidding/{id}/status").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/bidding/{id}").authenticated()
                        // --- Supplier Endpoints ---
                        // Example: Allow reading suppliers publicly, require auth for changes
                        .requestMatchers(HttpMethod.GET, "/api/supplier").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/supplier/{id}").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/supplier").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/supplier/{id}").authenticated()
                        .requestMatchers(HttpMethod.PUT, "/api/supplier/{id}/status").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/supplier/{id}").authenticated()

                        // --- [NEW RULE] Match Endpoints ---
                        // Requires authentication to see matches
                        .requestMatchers(HttpMethod.GET, "/api/match/**").authenticated()
                        .anyRequest().authenticated()
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}