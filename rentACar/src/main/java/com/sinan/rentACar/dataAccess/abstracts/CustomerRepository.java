package com.sinan.rentACar.dataAccess.abstracts;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sinan.rentACar.entities.concretes.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {
    
    // Sadece Müşterilere has kontroller (Örn: Bu TC Kimlik Numarası daha önce kullanılmış mı?)
    boolean existsByNationalIdentity(String nationalIdentity);
}
