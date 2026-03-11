# AI & Proje Hafızası (AI Memory & Project State)

Bu dosya, yapay zeka asistanının geliştirme süreçlerinde **bağlamı (context) kaybetmemesi**, geçmişte alınan teknik kararları hatırlaması ve SOLID başta olmak üzere projede oturtulmuş standartları koruması için oluşturulmuştur.

> 🤖 **Yapay Zeka Asistanı İçin Not:** Her yeni sohbet oturumunda (session) bu dosyayı hızlıca gözden geçir. Yaptığın önemli architectural, yapısal veya core değişiklikleri bu dosyaya ekle.

---

## 🛠️ Temel Proje Kuralları ve Mimarisi
1. **ModelMapper Kullanımı:** Tüm DTO-Entity ve Entity-DTO dönüşümleri (örneğin request alıp veritabanına kaydederken) manuel olarak (`entity.setX(dto.getX())`) **YAPILMAMALIDIR**. Sadece dışarıdan enjekte edilen veya sonradan hesaplanan (örn: `TotalPrice`) alanlar elle set edilmeli, geri kalanı `ModelMapperService` ile halledilmelidir.
2. **Business Rules (İş Kuralları):** Bir entity'nin veritabanında olup olmadığını kontrol etmek (Örn: `checkIfCarExists`, `checkIfUserExists`), `BusinessException` fırlatmak vs. doğrudan `Manager` sınıflarında yapılmaz. Her zaman `BusinessRules` (örn: `CarBusinessRules`, `RentalBusinessRules`) katmanına delege edilmeli, `Manager` sadece akışı yönetmelidir (orchestration).
3. **Exception Handling (Hata Yönetimi):** Java'nın standart `RuntimeException` veya `Exception` sınıfları fırlatılmamalıdır. Bunun yerine, GlobalExceptionHandler tarafından yakalanıp formatlı JSON (ProblemDetails) dönülebilmesi için projenin kendi `BusinessException` sınıfı kullanılmalıdır.

---

## 📅 Tamamlanan Önemli Görevler (Günlük / Kilometre Taşları)

### 7-8 Mart 2026
1. **Resim Yükleme (Cloudinary):**
   - Araçlara (Car) `imageUrl` sütunu eklendi.
   - `ImageService` (Cloudinary entegrasyonu) oluşturuldu ve `CarManager.uploadImage(int carId, MultipartFile file)` eklendi.
   - Frontend'de Base64 yerine `multipart/form-data` kullanılarak fotoğraf upload işlevi entegre edildi. Cloudinary başarılı şekilde çalışıyor.
   
2. **Kiralama (Rental) Motoru ve Core Logic:**
   - `Rental` entity oluşturuldu (`car`, `user`, `startDate`, `endDate`, `totalPrice`).
   - `RentalRepository` içine tarih çakışmasını (overlap) engelleyen `existsOverlappingRental` custom JPQL sorgusu eklendi.
   - Frontend Landing sayfasında "Hemen Kirala" butonuyla açılan, tarihleri seçtirip **canlı toplam fiyat hesaplaması (gün sayısı x dailyPrice)** yapan çok şık bir Kiralama Modal'ı oluşturuldu.
   - (Güvenlik) Kiralama yapmak için kullanıcının Login olması (JWT token) zorunlu kılındı. Backend, kiralamayı yapan kullanıcıyı JWT token içerisindeki subject/email'den (SecurityContext) güvenli bir şekilde çekiyor.

3. **Admin Dashboard Geliştirmeleri:**
   - Admin panelindeki Dashboard'a Recharts ile istatistikler (Araç Durum Pasta Grafiği, Marka Stok Sütun Grafiği) eklendi.
   - "Kiralamalar" adında yeni bir sekme (tab) eklenerek Admin'in sistemdeki tüm kiralamaları liste halinde görebilmesi sağlandı.
   
4. **SOLID Refactoring (Çok Önemli):**
   - Diğer yapay zeka oturumlarında `RentalManager` ve `CarManager` içinde yapılan, mimariye uymayan `RuntimeException fırlatma`, `Manuel Mapping` gibi kodlar temizlendi. Bu görevler `RentalBusinessRules` ve `CarBusinessRules` katmanlarına dağıtıldı.

5. **Küçük UI/UX Düzeltmeleri:**
   - Admin panelindeki "Çıkış Yap" (Logout) butonunun stili, koyu arka planda tamamen beyaz ve okunaklı olacak şekilde düzeltildi.

6. **Normal Kullanıcılar (Müşteri) İçin Profil Sayfası:**
   - `UserService`, `UserManager`, `UsersController` oluşturuldu. (`GET /api/users/me`, `PUT /api/users/me/password`)
   - `RentalsController` içerisine, giriş yapan kullanıcının kendi kiralamalarını getiren `GET /api/rentals/me` eklendi.
    - Frontend'de Yönetim Paneli yerine (Admin olmayan) normal kullanıcılar için `Profile.tsx` (Kullanıcı Bilgileri, Şifre Değiştirme, Kiralama Geçmişi) oluşturuldu.
    - Routing mantığı güncellenerek Dashboard yetkileri ayrıldı ve "Anasayfa" butonu direkt Landing Page'e yönlendirildi.

7. **Sanal Ödeme (Mock Payment) Entegrasyonu:**
    - Kiralama işleminde kullanıcı "Kirala" dediğinde hemen backend'e istek atılması yerine araya sanal bir Kredi Kartı ödeme animasyonu (Mock Payment form) eklendi (Frontend tabanlı, 2 saniye fake delay). UI olarak `Landing.tsx` üzerinde adımlar (Step 1/2) oluşturuldu.

8. **Gelişmiş Araç Özellikleri ve UI Filtreleri (`FuelType` & `TransmissionType`):**
    - Backend `Car` varlığına `fuelType` ve `transmissionType` (Enum, STRING) alanları eklendi. Update/Create işlemleri güncellendi.
    - Frontend `Landing.tsx` üzerinde Sadece Otomatik Toggle butonu ve Yakıt Tipi Select menüsü ile yeni özelliklere göre filtreleme sunuldu.
    - Vitrindeki araç kartlarının (Car Card) üzerine ilgili özellikler şık rozetler (Badge) olarak işlendi.

### 11 Mart 2026 - Faz 2: Performans, Güvenlik ve Kısıtlamalar (Production-Ready)
1. **Spring Cache (Önbellekleme) Entegrasyonu:**
    - Performansı artırmak ve veritabanı yükünü hafifletmek için Spring Boot Starter Cache kullanıldı.
    - `RentACarApplication` sınıfına `@EnableCaching` eklendi.
    - Sık okunan ama nadir değişen `BrandManager` (Markalar) ve `CarModelManager` (Modeller) listelerine `@Cacheable` eklendi.
    - Veri eklendiğinde veya silindiğinde önbelleğin temizlenmesi (veri tutarlılığı) için `@CacheEvict` kullanıldı. Bu aşamada in-memory çalışıldı, ileride Redis'e geçilecek.

2. **Resilience4j ile Rate Limiting (Aşırı İstek / DDoS Koruması):**
    - Kötü niyetli kullanıcıların API'yi spamlamasını engellemek için Resilience4j Rate Limiter eklendi.
    - `application.properties` içerisinde:
        - `api-rate-limiter`: `CarsController` ve `RentalsController` gibi endpoint'ler için saniyede 20 istek limiti.
        - `auth-rate-limiter`: `AuthController` (Login/Register) için dakikada 6 istek (Brute Force koruması).
    - `GlobalExceptionHandler` içerisine `RequestNotPermitted` sınıfı eklenip HTTP 429 Too Many Requests durum kodu dönülmesi sağlandı.
    - Frontend `Login.tsx` tarafında HTTP 429 yakalandığında buton disable edilip 59 saniyeden geriye sayan görsel bir bekleme (Countdown) kalkanı kodlandı.

3. **Gelişmiş Spring Security Hata Yönetimi & Zamanlama Saldırısı (Timing Attack) Koruması:**
    - Spring Security'nin standart "Kullanıcı Adı veya Şifre Hatalı" (hideUserNotFoundExceptions=true) mantığı `ApplicationConfig` üzerinden false yapıldı.
    - `GlobalExceptionHandler` içerisine `BadCredentialsException` (Yanlış şifre -> HTTP 401) ve `UsernameNotFoundException` (Kayıtlı olmayan e-posta -> HTTP 404) için özel ve anlamlı Problem Details yanıtları eklendi.
    - **ÇOK ÖNEMLİ:** Kötü niyetli kişilerin e-posta sorgusu sırasındaki gecikme farklarından (BCrypt hesaplama süresi/0.5sn) sistemde kayıtlı e-postaları tahmin etmesini (Timing Attack) engellemek adına; `ApplicationConfig` içinde kullanıcı bulunamadığı durumda dahi fake (sahte) bir `BCryptPasswordEncoder().encode("...")` çalıştırılarak gecikme (delay) simüle edildi.
