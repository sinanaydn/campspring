package com.sinan.rentACar.business.rules;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import com.sinan.rentACar.core.utilities.exceptions.BusinessException;
import com.sinan.rentACar.dataAccess.abstracts.CarRepository;
import com.sinan.rentACar.dataAccess.abstracts.RentalRepository;
import com.sinan.rentACar.dataAccess.abstracts.UserRepository;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class RentalBusinessRules {
    private final RentalRepository rentalRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;

    // KURAL 1: Bitiş tarihi, başlangıç tarihinden sonra olmalı
    public void checkIfEndDateIsAfterStartDate(LocalDate startDate, LocalDate endDate) {
        if (!endDate.isAfter(startDate)) {
            throw new BusinessException("Bitiş tarihi, başlangıç tarihinden sonra olmalıdır!");
        }
    }

    // KURAL 2 (EN KRİTİK): Aynı araç, aynı tarihlerde başka birine kiralanmış mı?
    public void checkIfCarIsAvailableForDates(int carId, LocalDate startDate, LocalDate endDate) {
        boolean hasOverlap = rentalRepository.existsOverlappingRental(carId, startDate, endDate);
        if (hasOverlap) {
            throw new BusinessException("Bu araç seçilen tarihlerde zaten başka bir müşteriye kiralanmış! Lütfen farklı tarihler seçiniz.");
        }
    }

    // KURAL 3: Araç sistemde kayıtlı mı?
    public void checkIfCarExists(int carId) {
        if (!this.carRepository.existsById(carId)) {
            throw new BusinessException("Araç bulunamadı! ID: " + carId);
        }
    }

    // KURAL 4: Kullanıcı sistemde kayıtlı mı?
    public void checkIfUserExists(String userEmail) {
        if (!this.userRepository.existsByEmail(userEmail)) {
            throw new BusinessException("Kullanıcı bulunamadı! Email: " + userEmail);
        }
    }
}
