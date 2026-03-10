package com.sinan.rentACar.business.abstracts;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import com.sinan.rentACar.business.requests.CreateCarModelRequest;
import com.sinan.rentACar.business.requests.UpdateCarModelRequest;
import com.sinan.rentACar.business.responses.GetAllCarModelResponse;

public interface CarModelService {
    Page<GetAllCarModelResponse> getAll(Pageable pageable);
    void add(CreateCarModelRequest createCarModelRequest);
    void update(UpdateCarModelRequest updateCarModelRequest);
    void delete(int id);
}
