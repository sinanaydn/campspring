package com.sinan.rentACar.business.concretes;

import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.sinan.rentACar.business.abstracts.RentalService;
import com.sinan.rentACar.business.requests.CreateRentalRequest;
import com.sinan.rentACar.business.responses.GetAllRentalsResponse;
import com.sinan.rentACar.business.rules.RentalBusinessRules;
import com.sinan.rentACar.core.utilities.mappers.ModelMapperService;
import com.sinan.rentACar.dataAccess.abstracts.CarRepository;
import com.sinan.rentACar.dataAccess.abstracts.RentalRepository;
import com.sinan.rentACar.dataAccess.abstracts.UserRepository;
import com.sinan.rentACar.entities.concretes.Car;
import com.sinan.rentACar.entities.concretes.Rental;
import com.sinan.rentACar.entities.concretes.User;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RentalManager implements RentalService {
    private final RentalRepository rentalRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final RentalBusinessRules rentalBusinessRules;
    private final ModelMapperService modelMapperService;

    @Override
    public List<GetAllRentalsResponse> getAll() {
        List<Rental> rentals = this.rentalRepository.findAll();
        return rentals.stream()
                .map(rental -> this.modelMapperService.forResponse().map(rental, GetAllRentalsResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<GetAllRentalsResponse> getByUserId(int userId) {
        List<Rental> rentals = this.rentalRepository.findByUserId(userId);
        return rentals.stream()
                .map(rental -> this.modelMapperService.forResponse().map(rental, GetAllRentalsResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public void add(CreateRentalRequest request, String userEmail) {
        // İŞ KURALLARI (Business Rules)
        this.rentalBusinessRules.checkIfEndDateIsAfterStartDate(request.getStartDate(), request.getEndDate());
        this.rentalBusinessRules.checkIfCarExists(request.getCarId());
        this.rentalBusinessRules.checkIfUserExists(userEmail);

        // İŞ KURALLARI - Tarih Çakışması Kontrolü (EN KRİTİK)
        this.rentalBusinessRules.checkIfCarIsAvailableForDates(
                request.getCarId(), request.getStartDate(), request.getEndDate());

        // Veritabanından verileri çek (Kurallar geçtiği için null gelmeyeceğinden eminiz)
        Car car = this.carRepository.findById(request.getCarId()).orElseThrow();
        User user = this.userRepository.findByEmail(userEmail);

        // TUTAR HESAPLAMA: Gün Sayısı × Günlük Fiyat
        long rentalDays = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate());
        double totalPrice = rentalDays * car.getDailyPrice();

        // Request -> Entity dönüşümünü ModelMapper ile yap
        Rental rental = this.modelMapperService.forRequest().map(request, Rental.class);
        rental.setId(null); // Yeni kayıt olduğu için ID sıfırla
        rental.setCar(car);
        rental.setUser(user);
        rental.setTotalPrice(totalPrice);

        this.rentalRepository.save(rental);
    }
}
