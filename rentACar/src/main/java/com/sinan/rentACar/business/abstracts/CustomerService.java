package com.sinan.rentACar.business.abstracts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sinan.rentACar.business.requests.RegisterCustomerRequest;
import com.sinan.rentACar.business.responses.GetCustomerResponse;

public interface CustomerService {
    void add(RegisterCustomerRequest registerCustomerRequest);
    Page<GetCustomerResponse> getAll(Pageable pageable);
    GetCustomerResponse getById(int id);
}
