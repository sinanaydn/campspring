package com.sinan.rentACar.core.utilities.exceptions;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProblemDetails {
    // Tüm hataların ortak modeli
    private String title;
    private String detail;
    private String type;
    private int status;
}
