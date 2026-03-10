package com.sinan.rentACar.business.concretes;

import org.springframework.stereotype.Service;

import com.sinan.rentACar.business.abstracts.AuthService;
import com.sinan.rentACar.business.abstracts.CustomerService;
import com.sinan.rentACar.business.requests.LoginRequest;
import com.sinan.rentACar.business.requests.RegisterCustomerRequest;
import com.sinan.rentACar.business.responses.AuthResponse;
import com.sinan.rentACar.core.security.JwtService;
import com.sinan.rentACar.dataAccess.abstracts.UserRepository;
import com.sinan.rentACar.entities.concretes.User;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class AuthManager implements AuthService {

    private final CustomerService customerService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    public AuthResponse registerCustomer(RegisterCustomerRequest registerCustomerRequest) {
        // 1. Müşteriyi sisteme kaydet
        this.customerService.add(registerCustomerRequest);
        
        // 2. Kaydedilen Kullanıcıyı Veritabanından Getir ve Anahtarını (Token) Üretip Ver
        User user = this.userRepository.findByEmail(registerCustomerRequest.getEmail());
        String token = this.jwtService.generateToken(user);
        
        return new AuthResponse(token);
    }

    @Override
    public AuthResponse login(LoginRequest loginRequest) {
        // 1. Spring Security kullanarak yetkilendirme (Şifre eşleşiyor mu?)
        this.authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        
        // 2. İşlem başarılıysa veritabanından kullanıcıyı çekip güncel JWT dön
        User user = this.userRepository.findByEmail(loginRequest.getEmail());
        String token = this.jwtService.generateToken(user);
        
        return new AuthResponse(token);
    }
}
