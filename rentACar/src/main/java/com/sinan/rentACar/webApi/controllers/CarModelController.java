package com.sinan.rentACar.webApi.controllers;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.sinan.rentACar.business.abstracts.CarModelService;
import com.sinan.rentACar.business.requests.CreateCarModelRequest;
import com.sinan.rentACar.business.requests.UpdateCarModelRequest;
import com.sinan.rentACar.business.responses.GetAllCarModelResponse;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/carmodels")
@AllArgsConstructor
public class CarModelController {
    private final CarModelService carModelService;

    @GetMapping
    public Page<GetAllCarModelResponse> getAll(Pageable pageable) {
        return this.carModelService.getAll(pageable);
    }

    @PostMapping
    @ResponseStatus(code = HttpStatus.CREATED)
    public void add(@RequestBody CreateCarModelRequest createCarModelRequest) {
        this.carModelService.add(createCarModelRequest);
    }
    
    @PutMapping
    @ResponseStatus(code = HttpStatus.OK)
    public void update(@RequestBody UpdateCarModelRequest updateCarModelRequest) {
        this.carModelService.update(updateCarModelRequest);
    }
    
    @DeleteMapping
    @ResponseStatus(code = HttpStatus.OK)
    public void delete(int id) {
        this.carModelService.delete(id);
    }
}
