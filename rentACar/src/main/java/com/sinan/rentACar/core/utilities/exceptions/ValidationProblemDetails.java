package com.sinan.rentACar.core.utilities.exceptions;

import java.util.Map;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
public class ValidationProblemDetails extends ProblemDetails {
    
    private Map<String, String> validationErrors;

    public ValidationProblemDetails() {
        setTitle("Validation Rule Violation");
        setDetail("One or more validation errors occurred.");
        setType("http://mydomain.com/exceptions/validation");
        setStatus(400);
    }
}
