package com.realestate.realestate_backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.realestate.realestate_backend.entity.UserEntity;
import com.realestate.realestate_backend.service.AuthService;
import com.realestate.realestate_backend.service.JwtService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    public AuthController(
            AuthService authService,
            JwtService jwtService) {

        this.authService = authService;
        this.jwtService = jwtService;
    }

    // REGISTER
    @PostMapping("/register")
    public ResponseEntity<?> register(
            @RequestBody UserEntity user) {

        try {

            UserEntity registeredUser =
                    authService.register(user);

            registeredUser.setPassword(null);

            return new ResponseEntity<>(
                    registeredUser,
                    HttpStatus.CREATED
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .body(e.getMessage());
        }
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody LoginRequest request) {

        try {

            UserEntity user =
                    authService.login(
                            request.getEmail(),
                            request.getPassword()
                    );

            // Generate JWT token
            String token =
                    jwtService.generateToken(user.getEmail());

            // Do not send password to frontend
            user.setPassword(null);

            return ResponseEntity.ok(
                    new LoginResponse(token, user)
            );

        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(e.getMessage());
        }
    }


    // LOGIN REQUEST
    public static class LoginRequest {

        private String email;
        private String password;

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }


    // LOGIN RESPONSE
    public static class LoginResponse {

        private String token;
        private UserEntity user;

        public LoginResponse(
                String token,
                UserEntity user) {

            this.token = token;
            this.user = user;
        }

        public String getToken() {
            return token;
        }

        public UserEntity getUser() {
            return user;
        }
    }
}