package com.projectNI.api.controller;

// import com.projectNI.api.dto.OtpRequestDTO;
// import com.projectNI.api.dto.OtpVerificationDTO;
// import com.projectNI.api.service.OtpService;
// import com.projectNI.api.dto.PasswordResetDTO;
import com.projectNI.api.dto.LoginRequestDTO;
import com.projectNI.api.dto.RegisterRequestDTO;
import com.projectNI.api.dto.ResponseDTO;
import com.projectNI.api.infra.security.TokenService;
import com.projectNI.api.model.User;
import com.projectNI.api.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final TokenService tokenService;
    // private final OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequestDTO body) {
        try {
            Optional<User> userOpt = this.repository.findByEmail(body.email());

            if(userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Email ou senha inválidos"));
            }

            User user = userOpt.get();

            if(passwordEncoder.matches(body.password(), user.getPassword())) {
                String token = this.tokenService.generateToken(user);
                return ResponseEntity.ok(new ResponseDTO(user.getName(), token, user.getIdUser()));
            }

            return ResponseEntity.badRequest().body(Map.of("message", "Email ou senha inválidos"));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erro ao fazer login"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDTO body) {
        // Check if user already exists
        Optional<User> existingUser = this.repository.findByEmail(body.email());

        if(existingUser.isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email já está em uso"));
        }

        try {
            User newUser = new User();
            newUser.setPassword(passwordEncoder.encode(body.password()));
            newUser.setEmail(body.email());
            newUser.setName(body.name());

            this.repository.save(newUser);

            String token = this.tokenService.generateToken(newUser);
            return ResponseEntity.ok(new ResponseDTO(newUser.getName(), token, newUser.getIdUser()));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Erro ao criar usuário"));
        }
    }
/*
    @PostMapping("/otp/request")
    public ResponseEntity<?> requestOtp(@RequestBody OtpRequestDTO body) {
        try {
            String result = otpService.generateAndSendOtp(body.email());
            return ResponseEntity.ok(Map.of("message", result));
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Failed to send OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/otp/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationDTO body) {
        try {
            boolean isValid = otpService.verifyOtp(body.email(), body.otp());

            if (isValid) {
                return ResponseEntity.ok(Map.of("message", "OTP verified successfully", "valid", true));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP", "valid", false));
            }
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error verifying OTP: " + e.getMessage(), "valid", false));
        }
    }

    @PostMapping("/password/reset")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetDTO body) {
        try {
            // Verify and consume the OTP (marks it as used)
            boolean isValid = otpService.verifyAndConsumeOtp(body.email(), body.otp());

            if (isValid) {
                Optional<User> userOpt = repository.findByEmail(body.email());

                if (userOpt.isEmpty()) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Usuário não encontrado"));
                }

                User user = userOpt.get();
                user.setPassword(passwordEncoder.encode(body.newPassword()));
                repository.save(user);

                return ResponseEntity.ok(Map.of("message", "Password reset successful"));
            } else {
                return ResponseEntity.badRequest().body(Map.of("message", "Invalid or expired OTP"));
            }
        } catch(Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error resetting password: " + e.getMessage()));
        }
    }
 */
}