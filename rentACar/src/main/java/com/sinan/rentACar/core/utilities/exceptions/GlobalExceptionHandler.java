package com.sinan.rentACar.core.utilities.exceptions;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 1. İş Kuralları (BusinessException) yakalayıcısı
    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public BusinessProblemDetails handleBusinessException(BusinessException businessException) {
        BusinessProblemDetails problemDetails = new BusinessProblemDetails();
        problemDetails.setDetail(businessException.getMessage());
        return problemDetails;
    }

    // 2. Validasyon (@Valid) hataları yakalayıcısı
    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.BAD_REQUEST)
    public ValidationProblemDetails handleValidationException(MethodArgumentNotValidException argumentNotValidException) {
        ValidationProblemDetails validationProblemDetails = new ValidationProblemDetails();
        
        Map<String, String> validationErrors = new HashMap<>(); // Hangi alan (Key) : Hangi Kural Patladı (Value)
        for (FieldError fieldError : argumentNotValidException.getBindingResult().getFieldErrors()) {
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }

        validationProblemDetails.setValidationErrors(validationErrors);
        return validationProblemDetails;
    }

    // 3. Sistemde Öngörülemeyen diğer genel hatalar (Internal Server Error)
    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR)
    public ProblemDetails handleOtherExceptions(Exception exception) {
        ProblemDetails problemDetails = new ProblemDetails();
        problemDetails.setTitle("Internal Server Error");
        problemDetails.setDetail("An unexpected error occurred. Please try again later.");
        problemDetails.setType("http://mydomain.com/exceptions/internal");
        problemDetails.setStatus(500);
        // exception.getMessage() doğrudan yazılmaz (Hacklenmeye karşı güvenlik için stack trace saklanır)
        return problemDetails;
    }
}
