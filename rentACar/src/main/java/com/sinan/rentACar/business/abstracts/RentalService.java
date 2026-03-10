package com.sinan.rentACar.business.abstracts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sinan.rentACar.business.requests.CreateRentalRequest;
import com.sinan.rentACar.business.responses.GetAllRentalsResponse;

public interface RentalService {
    Page<GetAllRentalsResponse> getAll(Pageable pageable);
    Page<GetAllRentalsResponse> getByUserId(int userId, Pageable pageable);
    void add(CreateRentalRequest createRentalRequest, String userEmail);
}
