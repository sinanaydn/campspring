package com.sinan.rentACar.business.concretes;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.sinan.rentACar.business.abstracts.CarModelService;
import com.sinan.rentACar.business.requests.CreateCarModelRequest;
import com.sinan.rentACar.business.requests.UpdateCarModelRequest;
import com.sinan.rentACar.business.responses.GetAllCarModelResponse;
import com.sinan.rentACar.core.utilities.mappers.ModelMapperService;
import com.sinan.rentACar.dataAccess.abstracts.CarModelRepository;
import com.sinan.rentACar.entities.concretes.CarModel;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CarModelManager implements CarModelService {
    private final CarModelRepository carModelRepository;
    private final ModelMapperService modelMapperService;
    
    @Override
    @Cacheable(value = "carmodels_pageable")
    public Page<GetAllCarModelResponse> getAll(Pageable pageable) {
        Page<CarModel> carModelPage = this.carModelRepository.findAll(pageable);
        return carModelPage.map(carModel -> this.modelMapperService.forResponse().map(carModel, GetAllCarModelResponse.class));
    }

    @Override
    @CacheEvict(value = "carmodels_pageable", allEntries = true)
    public void add(CreateCarModelRequest createCarModelRequest) {
        CarModel carModel = this.modelMapperService.forRequest().map(createCarModelRequest, CarModel.class);
        carModel.setId(null);
        this.carModelRepository.save(carModel);
    }

    @Override
    @CacheEvict(value = "carmodels_pageable", allEntries = true)
    public void update(UpdateCarModelRequest updateCarModelRequest) {
        CarModel existingCarModel = this.carModelRepository.findById(updateCarModelRequest.getId()).orElseThrow();
        this.modelMapperService.forRequest().map(updateCarModelRequest, existingCarModel);
        this.carModelRepository.save(existingCarModel);
    }

    @Override
    @CacheEvict(value = "carmodels_pageable", allEntries = true)
    public void delete(int id) {
        this.carModelRepository.deleteById(id);
    }

}
