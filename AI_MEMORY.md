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
