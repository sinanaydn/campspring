package com.sinan.rentACar.business.responses;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllRentalsResponse implements Serializable {
    private Integer id;
    private String carModelName;
    private String carPlate;
    private String userEmail;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double totalPrice;
}
