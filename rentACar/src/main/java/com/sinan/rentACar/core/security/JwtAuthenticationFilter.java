package com.sinan.rentACar.core.security;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. İstek (Request) içindeki Authorization başlığını al
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        //Eğer başlık yoksa veya 'Bearer ' ile başlamıyorsa zincire devam et ve geri dön
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. 'Bearer ' kısmını (ilk 7 karakteri) keserek sadece "şifreli token"ı alıyoruz
        jwt = authHeader.substring(7);

        // 3. Token'in içinden email adresini (kullanıcı adını) söküyoruz
        userEmail = jwtService.extractUsername(jwt);

        // 4. Eğer bir email çekemediysek VEYA kullanıcı zaten sistemde aktifse (Authenticated), güvenlik işlemini pas geç ve diğer filtreye gönder. (Erken Dönüş - Guard Clause)
        if (userEmail == null || SecurityContextHolder.getContext().getAuthentication() != null) {
            filterChain.doFilter(request, response);
            return;
        }

        // 5. Veritabanından kullanıcıyı bul!
        UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

        // 6. Eğer Tokenimizin son kullanım tarihi geçmişse VEYA sahteyse (isTokenValid == false), bileti oluşturmadan filtreyi geçir. (İç içe if kırmak için)
        if (!jwtService.isTokenValid(jwt, userDetails)) {
            filterChain.doFilter(request, response);
            return;
        }

        // 7. Her şey temiz ve güvenliyse biletini (AuthenticationToken) oluştur
        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities()
        );

        authToken.setDetails(
                new WebAuthenticationDetailsSource().buildDetails(request)
        );

        // Bu onaylanmış bileti Spring'in Güvenlik Cüzdanına (SecurityContextHolder) koyuyoruz.
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // Bu bariyerdeki işlemin bittiğini ve isteğin geçebileceğini Spring'e haber ver.
        filterChain.doFilter(request, response);
    }
}
