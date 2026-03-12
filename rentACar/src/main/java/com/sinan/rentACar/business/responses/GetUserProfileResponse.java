package com.sinan.rentACar.business.responses;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class GetUserProfileResponse implements Serializable {
    private Integer id;
    private String email;
    private String role;
}
