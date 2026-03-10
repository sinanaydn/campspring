package com.sinan.rentACar.dataAccess.abstracts;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sinan.rentACar.entities.concretes.Car;

public interface CarRepository extends JpaRepository<Car, Integer> {
    boolean existsByPlate(String plate);
}
