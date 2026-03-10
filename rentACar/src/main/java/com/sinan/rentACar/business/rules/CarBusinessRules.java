package com.sinan.rentACar.business.rules;

import org.springframework.stereotype.Service;

import com.sinan.rentACar.core.utilities.exceptions.BusinessException;
import com.sinan.rentACar.dataAccess.abstracts.CarRepository;

import lombok.AllArgsConstructor;

@AllArgsConstructor
@Service
public class CarBusinessRules {
    private final CarRepository carRepository;

    public void checkIfCarPlateExists(String plate) {
        if (this.carRepository.existsByPlate(plate)) {
            throw new BusinessException("Araç plakası zaten mevcut!");
        }
    }

    public void checkIfCarExists(int carId) {
        if (!this.carRepository.existsById(carId)) {
            throw new BusinessException("Araç bulunamadı! ID: " + carId);
        }
    }
}
