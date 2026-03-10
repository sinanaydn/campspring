package com.sinan.rentACar.dataAccess.abstracts;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sinan.rentACar.entities.concretes.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    
    // Yalnızca sisteme giriş yaparken veya "Bu email daha önce kayıtlı mı?" diye kontrol ederken.
    boolean existsByEmail(String email);
    
    // Auth (Login) işlemi sırasında e-posta ile kullanıcıyı tamamen bulup getirtmek için.
    User findByEmail(String email);
}
