package com.sinan.rentACar.business.concretes;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sinan.rentACar.business.abstracts.CustomerService;
import com.sinan.rentACar.business.requests.RegisterCustomerRequest;
import com.sinan.rentACar.business.responses.GetCustomerResponse;
import com.sinan.rentACar.business.rules.CustomerBusinessRules;
import com.sinan.rentACar.business.rules.UserBusinessRules;
import com.sinan.rentACar.core.utilities.mappers.ModelMapperService;
import com.sinan.rentACar.dataAccess.abstracts.CustomerRepository;
import com.sinan.rentACar.entities.concretes.Customer;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CustomerManager implements CustomerService {
    
    private final CustomerRepository customerRepository;
    private final ModelMapperService modelMapperService;
    private final CustomerBusinessRules customerBusinessRules;
    private final UserBusinessRules userBusinessRules;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void add(RegisterCustomerRequest registerCustomerRequest) {
        // 1. İş Kurallarını Çalıştır (Email ve TC Kimlik veritabanında daha önce var mı?)
        this.userBusinessRules.checkIfUserEmailExists(registerCustomerRequest.getEmail());
        this.customerBusinessRules.checkIfNationalIdentityExists(registerCustomerRequest.getNationalIdentity());

        // 2. DTO'yu Entity'e Çevir (Mapping)
        Customer customer = this.modelMapperService.forRequest().map(registerCustomerRequest, Customer.class);
        
        // 3. Şifreyi güvenlik için BCrypt ile Hashle ve varsayılan Rolünü ekle:
        customer.setPassword(this.passwordEncoder.encode(registerCustomerRequest.getPassword()));
        customer.setRole(com.sinan.rentACar.entities.enums.Role.USER);

        // 4. Veritabanına Kaydet
        this.customerRepository.save(customer);
    }

    @Override
    public List<GetCustomerResponse> getAll() {
        List<Customer> customers = this.customerRepository.findAll();
        return customers.stream()
                .map(customer -> this.modelMapperService.forResponse().map(customer, GetCustomerResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public GetCustomerResponse getById(int id) {
        Customer customer = this.customerRepository.findById(id).orElseThrow();
        return this.modelMapperService.forResponse().map(customer, GetCustomerResponse.class);
    }
}
