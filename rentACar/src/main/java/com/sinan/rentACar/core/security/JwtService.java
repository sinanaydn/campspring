package com.sinan.rentACar.core.security;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.sinan.rentACar.entities.concretes.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

    // Token şifrelemesi için kullanacağımız 256 bitlik gizli anahtar (Sizde kalsın, kimse bilmesin!)
    @Value("${jwt.secret.key}")
    private String SECRET_KEY;

    // Token geçerlilik süresi (Örn: 24 saat = 1000 * 60 * 60 * 24 milisaniye)
    @Value("${jwt.expiration.time}")
    private long EXPIRATION_TIME;

    // Dışarıdan "Bana bu kullanıcı için yetkili kimlik kartı üret" denildiğinde çalışan ana metot.
    public String generateToken(UserDetails userDetails) {
        return generateToken(new HashMap<>(), userDetails);
    }

    // Token içerisine (Payload/Gövde) kullanıcının Rolünü vb. eklemek için ezilmiş (Overload) metot.
    public String generateToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        
        // Kullanıcı sınıfımızı döküm (cast) ederek rolü tokene iliştiriyoruz (Java 16+ Pattern Matching kullanılarak)
        if (userDetails instanceof User currentEntity) {
            extraClaims.put("role", currentEntity.getRole().name());
            extraClaims.put("userId", currentEntity.getId());
        }

        // Eğer userDetails null ise boş bir string dönsün veya hata fırlatsın, şimdilik güvenliği sağlamak adına username'i alıyoruz.
        String username = (userDetails != null) ? userDetails.getUsername() : "";

        return Jwts
                .builder()
                .claims(extraClaims) // Ekstra özellikleri (rol, id) tokene bas
                .subject(username) // Tokenin sahibini (Email) bas
                .issuedAt(new Date(System.currentTimeMillis())) // Token verilme anı
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // Ne zaman geçersiz olacak
                .signWith(getSignInKey()) // Dijital imzamız (Secret key'imiz ile)
                .compact(); // Oluştur ve fırlat!
    }

    // Sistemin gizli (Base64) kodunu JWT'nin algoritmasına (HMAC-SHA256) çeviren anahtar okuyucu
    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // Token içerisinden kullanıcı adını (subject/email) çözüp çıkarma metodu
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    // İstenilen herhangi bir özel iddiayı (claim) token'dan alma yetkisi
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    // Token geçerli mi, tarihi geçmiş mi veya sahte mi diye kontrol etme
    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    // Tokenin süresi dolmuş mu kontrolü
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    // Son kullanma tarihini çek
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    // Token'ın tüm iç organlarını (payload) parçala
    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith((javax.crypto.SecretKey) getSignInKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}
