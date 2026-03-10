package com.sinan.rentACar.dataAccess.abstracts;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sinan.rentACar.entities.concretes.CarModel;

public interface CarModelRepository extends JpaRepository<CarModel, Integer> {

}
