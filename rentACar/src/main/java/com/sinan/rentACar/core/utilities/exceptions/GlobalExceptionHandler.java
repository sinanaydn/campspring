package com.sinan.rentACar.core.utilities.exceptions;

import java.util.HashMap;
import java.util.Map;

import io.github.resilience4j.ratelimiter.RequestNotPermitted;
import org.springframework.http.HttpStatus;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
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

    // 3. Eşzamanlılık (Concurrency - Optimistic Locking) hataları yakalayıcısı
    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.CONFLICT)
    public ProblemDetails handleOptimisticLockingException(ObjectOptimisticLockingFailureException exception) {
        ProblemDetails problemDetails = new ProblemDetails();
        problemDetails.setTitle("Concurrency Conflict");
        problemDetails.setDetail("İşlem yapmaya çalıştığınız kayıt başka bir kullanıcı tarafından az önce güncellendi. Lütfen sayfayı yenileyip tekrar deneyin.");
        problemDetails.setType("http://mydomain.com/exceptions/conflict");
        problemDetails.setStatus(HttpStatus.CONFLICT.value());
        return problemDetails;
    }

    // 4. Rate Limiting (Aşırı İstek / DDoS Koruması) hataları yakalayıcısı
    @ExceptionHandler
    @ResponseStatus(code = HttpStatus.TOO_MANY_REQUESTS)
    public ProblemDetails handleRateLimiterException(RequestNotPermitted exception) {
        ProblemDetails problemDetails = new ProblemDetails();
        problemDetails.setTitle("Too Many Requests");
        problemDetails.setDetail("Çok fazla istek gönderdiniz. Lütfen biraz bekleyip tekrar deneyin.");
        problemDetails.setType("http://mydomain.com/exceptions/too-many-requests");
        problemDetails.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        return problemDetails;
    }

    // 5. Sistemde Öngörülemeyen diğer genel hatalar (Internal Server Error)
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
