package com.sinan.rentACar.business.requests;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateCarRequest {
    @NotNull
    @Min(value = 1900)
    private Integer modelYear;
    
    @NotNull
    @NotBlank
    private String plate;
    
    @NotNull
    @Min(value = 0)
    private Double dailyPrice;
    
    @NotNull
    private Integer state;
    
    @NotNull
    private Integer modelId;

    @NotNull
    @NotBlank
    private String fuelType;

    @NotNull
    @NotBlank
    private String transmissionType;
}
