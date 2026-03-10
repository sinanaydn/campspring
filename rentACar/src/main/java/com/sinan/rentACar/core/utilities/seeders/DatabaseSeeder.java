package com.sinan.rentACar.core.utilities.seeders;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.sinan.rentACar.dataAccess.abstracts.UserRepository;
import com.sinan.rentACar.entities.concretes.Employee;
import com.sinan.rentACar.entities.enums.Role;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

/**
 * Bu sınıf uygulama her ayağa kalktığında (Run edildiğinde) otomatik olarak çalışır.
 * Eğer veritabanında henüz bir ADMIN (Yönetici) yoksa onu sihirli bir şekilde oluşturur.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${system.admin.email}")
    private String adminEmail;

    @Value("${system.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {

        // 1. Veritabanını kontrol et: Bu mail adresiyle daha önceden açılmış bir hesap var mı?
        if (!userRepository.existsByEmail(adminEmail)) {
            
            log.info("Sistemde Kurucu Admin hesabı bulunamadı. Hemen oluşturuluyor...");

            // 2. Eğer yoksa 'Employee' (Çalışan/Yönetici) olarak yepyeni bir nesne üret
            Employee systemAdmin = new Employee();
            
            // Bizim sistemimizde User temel sınıftır. O yüzden User özelliklerini dolduruyoruz.
            systemAdmin.setEmail(adminEmail);
            systemAdmin.setPassword(passwordEncoder.encode(adminPassword)); // Şifre (DB'ye şifrelenmiş (hash) haliyle kaydedilecek)
            systemAdmin.setRole(Role.ADMIN); // PATRON (ADMIN) YETKİSİ MÜHÜRLENDİ!
            
            // Çalışan'a (Employee) ait özel veriler (İsteğe bağlı)
            systemAdmin.setDepartment("Yönetim Kurulu");
            systemAdmin.setSalary(0.0); // Şirket sahibi olduğu için maaşsız :)

            // 3. Veritabanına bu büyük patronu enjekte et!
            userRepository.save(systemAdmin);

            log.info("Süper Admin Başarıyla Eklendi -> Email: {} | Şifre: {}", adminEmail, adminPassword);
        } else {
            log.info("Admin hesabı sistemde zaten mevcut. Yeni ekleme yapılmadı.");
        }
    }
}
