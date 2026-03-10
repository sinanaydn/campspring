package com.sinan.rentACar.business.abstracts;

import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.web.multipart.MultipartFile;

import com.sinan.rentACar.business.requests.CreateCarRequest;
import com.sinan.rentACar.business.requests.UpdateCarRequest;
import com.sinan.rentACar.business.responses.GetAllCarsResponse;

public interface CarService {
    Page<GetAllCarsResponse> getAll(Pageable pageable);
    void add(CreateCarRequest createCarRequest);
    void update(UpdateCarRequest updateCarRequest);
    void delete(int id);
    void uploadImage(int carId, MultipartFile file) throws IOException;
}
