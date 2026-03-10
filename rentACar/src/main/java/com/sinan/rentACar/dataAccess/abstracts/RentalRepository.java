package com.sinan.rentACar.dataAccess.abstracts;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.sinan.rentACar.entities.concretes.Rental;

public interface RentalRepository extends JpaRepository<Rental, Integer> {

    // Aynı araca, belirtilen tarih aralığında çakışan aktif bir kiralama var mı?
    // SQL mantığı: Mevcut bir kiralama zaten varsa VE yeni istenen tarihler o kiralamanın tarihlerinin içine veya üstüne düşüyorsa -> Çakışma var!
    @Query("SELECT CASE WHEN COUNT(r) > 0 THEN TRUE ELSE FALSE END FROM Rental r " +
           "WHERE r.car.id = :carId " +
           "AND r.startDate <= :endDate " +
           "AND r.endDate >= :startDate")
    boolean existsOverlappingRental(
            @Param("carId") int carId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    // Belirli bir kullanıcının tüm kiralamalarını getir
    List<Rental> findByUserId(int userId);

    // Belirli bir aracın tüm kiralamalarını getir
    List<Rental> findByCarId(int carId);
}
