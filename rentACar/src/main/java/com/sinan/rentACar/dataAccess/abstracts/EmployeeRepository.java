package com.sinan.rentACar.dataAccess.abstracts;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sinan.rentACar.entities.concretes.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, Integer> {
    
    // Şirket çalışanlarına/Yöneticilere özel sorgular ileride buraya eklenecektir.
    // Şimdilik sadece CRUD işlemleri için JpaRepository'den implemente etmesi yeterlidir.
}
