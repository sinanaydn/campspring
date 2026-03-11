package com.sinan.rentACar.webApi.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sinan.rentACar.business.abstracts.AuthService;
import com.sinan.rentACar.business.requests.LoginRequest;
import com.sinan.rentACar.business.requests.RegisterCustomerRequest;
import com.sinan.rentACar.business.responses.AuthResponse;

import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
@RateLimiter(name = "auth-rate-limiter")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(code = HttpStatus.CREATED)
    public AuthResponse register(@RequestBody @Valid RegisterCustomerRequest registerCustomerRequest) {
        return this.authService.registerCustomer(registerCustomerRequest);
    }

    @PostMapping("/login")
    @ResponseStatus(code = HttpStatus.OK)
    public AuthResponse login(@RequestBody @Valid LoginRequest loginRequest) {
        return this.authService.login(loginRequest);
    }
}
