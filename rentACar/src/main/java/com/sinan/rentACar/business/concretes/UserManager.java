package com.sinan.rentACar.business.concretes;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sinan.rentACar.business.abstracts.UserService;
import com.sinan.rentACar.business.requests.UpdateUserPasswordRequest;
import com.sinan.rentACar.business.responses.GetUserProfileResponse;
import com.sinan.rentACar.business.rules.UserBusinessRules;
import com.sinan.rentACar.core.utilities.mappers.ModelMapperService;
import com.sinan.rentACar.dataAccess.abstracts.UserRepository;
import com.sinan.rentACar.entities.concretes.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserManager implements UserService {

    private final UserRepository userRepository;
    private final UserBusinessRules userBusinessRules;
    private final ModelMapperService modelMapperService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public GetUserProfileResponse getProfile(String userEmail) {
        this.userBusinessRules.checkIfUserExists(userEmail);
        User user = this.userRepository.findByEmail(userEmail);
        return this.modelMapperService.forResponse().map(user, GetUserProfileResponse.class);
    }

    @Override
    public void updatePassword(String userEmail, UpdateUserPasswordRequest request) {
        this.userBusinessRules.checkIfUserExists(userEmail);
        User user = this.userRepository.findByEmail(userEmail);

        this.userBusinessRules.checkIfOldPasswordMatches(request.getCurrentPassword(), user);

        user.setPassword(this.passwordEncoder.encode(request.getNewPassword()));
        this.userRepository.save(user);
    }
}
