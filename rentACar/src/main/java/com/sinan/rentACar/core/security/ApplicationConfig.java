package com.sinan.rentACar.core.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.sinan.rentACar.dataAccess.abstracts.UserRepository;
import com.sinan.rentACar.entities.concretes.User;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final UserRepository userRepository;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            User user = userRepository.findByEmail(username);
            if (user == null) {
                // Zamanlama Saldırısı (Timing Attack) Koruması:
                // Email bulunamadığında sistemin "anında" cevap dönmesi bir güvenlik açığıdır.
                // Kötü niyetli kişiler bunu kullanarak hangi e-postaların kayıtlı olduğunu tespit edebilir.
                // Sistemde var olan bir kullanıcı girişindeki "BCrypt doğrulama gecikmesini" taklit etmek için,
                // kullanıcı yoksa bile BCrypt algoritmasını boşa çalıştırıp o yarım saniyelik doğal gecikmeyi ekliyoruz.
                new BCryptPasswordEncoder().encode("security_dummy_password");

                throw new UsernameNotFoundException("Sistemde böyle bir e-posta adresine sahip kullanıcı bulunamadı.");
            }
            return user;
        };
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        // Güvenlik: UsernameNotFoundException hatasını saklamaması için false yaptık
        authProvider.setHideUserNotFoundExceptions(false);
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
