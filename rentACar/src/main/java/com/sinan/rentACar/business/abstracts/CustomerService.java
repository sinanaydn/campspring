package com.sinan.rentACar.business.abstracts;

import java.util.List;

import com.sinan.rentACar.business.requests.RegisterCustomerRequest;
import com.sinan.rentACar.business.responses.GetCustomerResponse;

public interface CustomerService {
    void add(RegisterCustomerRequest registerCustomerRequest);
    List<GetCustomerResponse> getAll();
    GetCustomerResponse getById(int id);
}
