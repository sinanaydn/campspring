package com.sinan.rentACar.core.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/api/auth/**",
                    "/v3/api-docs/**",
                    "/swagger-ui/**",
                    "/swagger-ui.html"
                ).permitAll()
                // Müşterilerin görebilmesi için Liste getirme (GET) yolları herkese açık
                .requestMatchers(HttpMethod.GET, "/api/brands/**", "/api/carmodels/**", "/api/cars/**").permitAll()
                // Geri kalan tüm yönetim işlemleri (Ekle, Sil, Güncelle) için kullanıcının ADMIN Rolü olmalı!
                .requestMatchers("/api/brands/**", "/api/carmodels/**", "/api/cars/**").hasAuthority("ADMIN")
                // Kiralama: Listeleme (me haricinde) sadece Admin, Kiralama oluşturma ve kendi listesini görme giriş yapmış herkes yapabilir
                .requestMatchers(HttpMethod.GET, "/api/rentals").hasAuthority("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/rentals/me", "/api/users/me").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/me/password").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/rentals/**").authenticated()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // React'in çalıştığı port adresini güvenilir (izin verilen) rota olarak ekle
        configuration.addAllowedOrigin("http://localhost:5173"); 
        
        // Hangi HTTP isteklerine (Methodlara) izin verilecek? (Hepsine)
        configuration.addAllowedMethod("*"); 
        
        // Hangi Header (Başlıklara) izin verilecek? (Token, vs. için hepsi)
        configuration.addAllowedHeader("*");
        
        // Kimlik doğrulama çerezleri veya Header'larının (Authorization) geçişine izin ver
        configuration.setAllowCredentials(true); 

        // Kuralları tüm uç noktalar için (/**) aktifleştir
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}
