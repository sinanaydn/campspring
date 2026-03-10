package com.sinan.rentACar.business.abstracts;

import com.sinan.rentACar.business.requests.LoginRequest;
import com.sinan.rentACar.business.requests.RegisterCustomerRequest;
import com.sinan.rentACar.business.responses.AuthResponse;

public interface AuthService {
    AuthResponse registerCustomer(RegisterCustomerRequest registerCustomerRequest);
    AuthResponse login(LoginRequest loginRequest);
}
