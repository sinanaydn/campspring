package com.sinan.rentACar.business.abstracts;

import java.util.List;

import com.sinan.rentACar.business.requests.CreateCarModelRequest;
import com.sinan.rentACar.business.requests.UpdateCarModelRequest;
import com.sinan.rentACar.business.responses.GetAllCarModelResponse;

public interface CarModelService {
    List<GetAllCarModelResponse> getAll();
    void add(CreateCarModelRequest createCarModelRequest);
    void update(UpdateCarModelRequest updateCarModelRequest);
    void delete(int id);
}
