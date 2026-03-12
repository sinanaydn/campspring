package com.sinan.rentACar.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetAllCarsResponse implements Serializable {
    private Integer id;
    private Integer modelYear;
    private String plate;
    private Double dailyPrice;
    private Integer state;
    private String modelName;
    private String imageUrl;
    private String fuelType;
    private String transmissionType;
}
