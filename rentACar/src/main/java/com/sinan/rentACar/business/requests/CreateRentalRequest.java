package com.sinan.rentACar.business.requests;

import java.time.LocalDate;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateRentalRequest {
    @NotNull
    private Integer carId;

    @NotNull
    @FutureOrPresent(message = "Başlangıç tarihi bugün veya ileri bir tarih olmalıdır!")
    private LocalDate startDate;

    @NotNull
    @Future(message = "Bitiş tarihi ileri bir tarih olmalıdır!")
    private LocalDate endDate;
}
