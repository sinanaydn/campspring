package com.sinan.rentACar.business.concretes;

import java.util.List;
import java.util.stream.Collectors;

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
    public List<GetAllCarModelResponse> getAll() {
        List<CarModel> carModels = this.carModelRepository.findAll();
        List<GetAllCarModelResponse> getAllCarModelResponses = carModels.stream()
        .map(carModel -> this.modelMapperService.forResponse().map(carModel, GetAllCarModelResponse.class))
        .collect(Collectors.toList());
        return getAllCarModelResponses;
    }

    @Override
    public void add(CreateCarModelRequest createCarModelRequest) {
        CarModel carModel = this.modelMapperService.forRequest().map(createCarModelRequest, CarModel.class);
        carModel.setId(null);
        this.carModelRepository.save(carModel);
    }

    @Override
    public void update(UpdateCarModelRequest updateCarModelRequest) {
        CarModel existingCarModel = this.carModelRepository.findById(updateCarModelRequest.getId()).orElseThrow();
        this.modelMapperService.forRequest().map(updateCarModelRequest, existingCarModel);
        this.carModelRepository.save(existingCarModel);
    }

    @Override
    public void delete(int id) {
        this.carModelRepository.deleteById(id);
    }

}
