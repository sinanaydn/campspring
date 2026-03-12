package com.sinan.rentACar.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse implements Serializable {
    
    // JWT Token'ı frontend'e veya istemciye (postman vs) dönmek için
    private String token;
}
