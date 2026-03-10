package com.sinan.rentACar.entities.concretes;

import com.sinan.rentACar.entities.enums.FuelType;
import com.sinan.rentACar.entities.enums.TransmissionType;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;  
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "cars")
public class Car {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "model_year")
    private Integer modelYear;
    @Column(name = "plate")
    private String plate;
    @Column(name = "daily_price")
    private Double dailyPrice;
    @Column(name = "state")
    private Integer state;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type")
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    @Column(name = "transmission_type")
    private TransmissionType transmissionType;

    @ManyToOne
    @JoinColumn(name = "model_id")
    private CarModel carModel;

    @Version
    @Column(name = "version")
    private Long version;
}
