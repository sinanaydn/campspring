package com.sinan.rentACar.business.rules;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sinan.rentACar.core.utilities.exceptions.BusinessException;
import com.sinan.rentACar.dataAccess.abstracts.UserRepository;
import com.sinan.rentACar.entities.concretes.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserBusinessRules {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void checkIfUserEmailExists(String email) {
        if (this.userRepository.existsByEmail(email)) {
            throw new BusinessException("User email already exists!");
        }
    }

    public void checkIfUserExists(String email) {
        if (!this.userRepository.existsByEmail(email)) {
            throw new BusinessException("Kullanıcı bulunamadı!");
        }
    }

    public void checkIfOldPasswordMatches(String currentPassword, User user) {
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new BusinessException("Mevcut şifreniz yanlış!");
        }
    }
}
