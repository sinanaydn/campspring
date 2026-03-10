package com.sinan.rentACar.business.requests;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserPasswordRequest {

    @NotBlank(message = "Mevcut şifre boş bırakılamaz")
    private String currentPassword;

    @NotBlank(message = "Yeni şifre boş bırakılamaz")
    @Size(min = 6, message = "Yeni şifreniz en az 6 karakter olmalıdır")
    private String newPassword;
}
