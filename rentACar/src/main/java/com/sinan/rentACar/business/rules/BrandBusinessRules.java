package com.sinan.rentACar.business.rules;

import org.springframework.stereotype.Service;

import com.sinan.rentACar.core.utilities.exceptions.BusinessException;
import com.sinan.rentACar.dataAccess.abstracts.BrandRepository;

import lombok.AllArgsConstructor;
@Service
@AllArgsConstructor
public class BrandBusinessRules {
    private final BrandRepository brandRepository;
    public void checkIfBrandNameExists(String name) {
        if (this.brandRepository.existsByName(name)) {
            throw new BusinessException("Brand name already exists");
        }
    }
}
