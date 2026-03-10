package com.sinan.rentACar.webApi.controllers;

import java.security.Principal;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sinan.rentACar.business.abstracts.RentalService;
import com.sinan.rentACar.business.abstracts.UserService;
import com.sinan.rentACar.business.requests.CreateRentalRequest;
import com.sinan.rentACar.business.responses.GetAllRentalsResponse;
import com.sinan.rentACar.business.responses.GetUserProfileResponse;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/rentals")
@AllArgsConstructor
public class RentalsController {
    private final RentalService rentalService;
    private final UserService userService;

    // Tüm kiralamaları listele (Admin için)
    @GetMapping
    public List<GetAllRentalsResponse> getAll() {
        return this.rentalService.getAll();
    }

    // Giriş yapan kullanıcının kendi kiralamalarını listele
    @GetMapping("/me")
    public List<GetAllRentalsResponse> getMyRentals(Principal principal) {
        GetUserProfileResponse userProfile = this.userService.getProfile(principal.getName());
        return this.rentalService.getByUserId(userProfile.getId());
    }

    // Yeni kiralama oluştur
    // Principal: Spring Security'nin JWT Token'dan otomatik olarak çıkardığı giriş yapan kullanıcı bilgisi.
    // Böylece kimin kiraladığını frontend'den göndermemize gerek kalmaz, Token zaten söyler!
    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void add(@RequestBody @Valid CreateRentalRequest createRentalRequest, Principal principal) {
        this.rentalService.add(createRentalRequest, principal.getName());
    }
}
