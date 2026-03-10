package com.sinan.rentACar.entities.concretes;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.sinan.rentACar.entities.enums.Role;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Inheritance;
import jakarta.persistence.InheritanceType;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    
    @Column(name = "email", unique = true)
    private String email;
    
    @Column(name = "password")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(name = "role")
    private Role role;

    // --- Spring Security Kullanıcı Özellikleri ---

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Kullanıcının sistemdeki rolünü (Admin/User) Spring'in anlayacağı bir Authority objesine çeviriyoruz.
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getUsername() {
        // Biz sisteme Email ile giriş yaptığımız için Spring Security nezdinde Username bizim için e-postadır.
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        // Hesap zaman aşımına uğramış mı? Hayır, hesap hep açık.
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        // Kullanıcı Çok fazla hatalı giriş yaptı da kilitlendi mi? Hayır.
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        // Kullanıcının şifresinin süresi (3 ayda bir değiştir falan) doldu mu? Hayır.
        return true;
    }

    @Override
    public boolean isEnabled() {
        // Kullanıcının hesabı sistem yöneticisi tarafından yasaklanmış (banlı) mı? Pasif mi? Hayır.
        return true;
    }
}
