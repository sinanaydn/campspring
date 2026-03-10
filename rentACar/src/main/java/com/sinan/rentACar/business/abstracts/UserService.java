package com.sinan.rentACar.business.abstracts;

import com.sinan.rentACar.business.requests.UpdateUserPasswordRequest;
import com.sinan.rentACar.business.responses.GetUserProfileResponse;

public interface UserService {
    GetUserProfileResponse getProfile(String userEmail);
    void updatePassword(String userEmail, UpdateUserPasswordRequest request);
}
