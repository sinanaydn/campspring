package com.sinan.rentACar.entities.concretes;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "employees")
@EqualsAndHashCode(callSuper = true)
public class Employee extends User {

    @Column(name = "salary")
    private Double salary;
    
    // Yöneticilerin/Çalışanların departmanı veya pozisyonu eklenebilir.
    @Column(name = "department")
    private String department;
}
