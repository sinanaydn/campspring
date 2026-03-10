package com.sinan.rentACar.webApi.controllers;

import java.security.Principal;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sinan.rentACar.business.abstracts.UserService;
import com.sinan.rentACar.business.requests.UpdateUserPasswordRequest;
import com.sinan.rentACar.business.responses.GetUserProfileResponse;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/users")
@AllArgsConstructor
public class UsersController {
    
    private final UserService userService;

    @GetMapping("/me")
    public GetUserProfileResponse getMyProfile(Principal principal) {
        return this.userService.getProfile(principal.getName());
    }

    @PutMapping("/me/password")
    @ResponseStatus(code = HttpStatus.OK)
    public void updatePassword(@RequestBody @Valid UpdateUserPasswordRequest request, Principal principal) {
        this.userService.updatePassword(principal.getName(), request);
    }
}
