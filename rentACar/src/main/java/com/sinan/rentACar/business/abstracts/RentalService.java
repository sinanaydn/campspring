package com.sinan.rentACar.business.abstracts;

import java.util.List;

import com.sinan.rentACar.business.requests.CreateRentalRequest;
import com.sinan.rentACar.business.responses.GetAllRentalsResponse;

public interface RentalService {
    List<GetAllRentalsResponse> getAll();
    List<GetAllRentalsResponse> getByUserId(int userId);
    void add(CreateRentalRequest createRentalRequest, String userEmail);
}
