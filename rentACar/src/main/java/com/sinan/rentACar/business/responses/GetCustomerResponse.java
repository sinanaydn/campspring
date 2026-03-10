package com.sinan.rentACar.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetCustomerResponse {
    
    // Müşterinin profili veya "Hesabım" sayfası istendiğinde döndürülecek temiz veriler
    private int id;
    private String firstName;
    private String lastName;
    private String email;
    private String nationalIdentity;
}
