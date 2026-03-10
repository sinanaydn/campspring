package com.sinan.rentACar.business.concretes;

import java.io.IOException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sinan.rentACar.business.abstracts.CarService;
import com.sinan.rentACar.business.requests.CreateCarRequest;
import com.sinan.rentACar.business.requests.UpdateCarRequest;
import com.sinan.rentACar.business.responses.GetAllCarsResponse;
import com.sinan.rentACar.business.rules.CarBusinessRules;
import com.sinan.rentACar.core.utilities.exceptions.BusinessException;
import com.sinan.rentACar.core.utilities.mappers.ModelMapperService;
import com.sinan.rentACar.core.utilities.services.cloudinary.ImageService;
import com.sinan.rentACar.dataAccess.abstracts.CarRepository;
import com.sinan.rentACar.entities.concretes.Car;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class CarManager implements CarService {
    private final CarRepository carRepository;
    private final ModelMapperService modelMapperService;
    private final CarBusinessRules carBusinessRules;
    private final ImageService imageService;

    @Override
    public Page<GetAllCarsResponse> getAll(Pageable pageable) {
        Page<Car> carPage = this.carRepository.findAll(pageable);
        return carPage.map(car -> this.modelMapperService.forResponse().map(car, GetAllCarsResponse.class));
    }

    @Override
    public void add(CreateCarRequest createCarRequest) {
        // İş Kuralları (Business Rules)
        this.carBusinessRules.checkIfCarPlateExists(createCarRequest.getPlate());

        Car car = this.modelMapperService.forRequest().map(createCarRequest, Car.class);
        
        // Similar to CarModel, resetting the ID here to avoid stale object mapping issues in JPA
        car.setId(null);

        this.carRepository.save(car);
    }

    @Override
    public void update(UpdateCarRequest updateCarRequest) {
        Car car = this.modelMapperService.forRequest().map(updateCarRequest, Car.class);
        this.carRepository.save(car);
    }

    @Override
    public void delete(int id) {
        this.carRepository.deleteById(id);
    }

    @Override
    public void uploadImage(int carId, MultipartFile file) throws IOException {
        Car car = this.carRepository.findById(carId).orElseThrow(
            () -> new BusinessException("Araç bulunamadı! ID: " + carId)
        );
        // Cloudinary'ye resmi yükle ve dönen URL'yi al
        String imageUrl = this.imageService.upload(file);
        // URL'yi veritabanındaki araç kaydına yaz
        car.setImageUrl(imageUrl);
        this.carRepository.save(car);
    }
}
