package com.sinan.rentACar.business.rules;

import org.springframework.stereotype.Service;

import com.sinan.rentACar.core.utilities.exceptions.BusinessException;
import com.sinan.rentACar.dataAccess.abstracts.CustomerRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CustomerBusinessRules {
    private final CustomerRepository customerRepository;

    public void checkIfNationalIdentityExists(String nationalIdentity) {
        if (this.customerRepository.existsByNationalIdentity(nationalIdentity)) {
            throw new BusinessException("Customer with this national identity already exists!");
        }
    }
}
