# AI Project Memory & Master State (AI_MEMORY.md)

Bu doküman, yapay zeka asistanlarının (AI) projeye her yeni oturumda (session) dahil olduğunda projeyi sıfırdan öğrenmemesi, tüm bağlamı (context) anında kavrayabilmesi ve kod yazarken oturtulmuş kuralların dışına çıkmaması için tasarlanmış ana referans dosyasıdır.

> 🤖 **Yapay Zeka Asistanı İçin Kritik Not:** Yeni bir sohbete başladığında GÖREVİN NE OLURSA OLSUN önce bu dosyayı baştan aşağı oku. Kod önerilerini buradaki mimari sınırlamalara ve Java/Spring sürümlerine göre yap. Yeni bir eklenti veya köklü mimari değişikliği yaptığında bu dosyayı GÜNCELLE.

---

## 1. Project Overview & Tech Stack (Teknoloji Yığını)
Bu proje, modern mimariyle geliştirilmiş, Dockerize edilmiş web tabanlı bir "Rent A Car" (Araç Kiralama) otomasyonudur.

*   **Backend Core:** Java 25, Spring Boot 4.0.3, Maven
*   **Database & ORM:** PostgreSQL 16 (on Docker), Spring Data JPA, Hibernate
*   **Caching & Performance:** Redis 7 (on Docker), Spring Cache (`@Cacheable`)
*   **Security & Protection:** Resilience4j (Rate Limiting, DDoS Protection), Spring Security (JWT Token, BCrypt), Custom Timing Attack Prevention
*   **Infrastructure:** Docker, Docker Compose (`docker-compose.yml`), Multi-stage `Dockerfile` (Alpine JRE)
*   **Frontend End:** React, TypeScript, Vite, Tailwind CSS, shadcn/ui

---

## 2. Core Architectural Rules & Standards (Kırmızı Çizgiler)
AI kod üretirken **AŞAĞIDAKİ KURALLARIN HİÇBİRİNİ ESNEMEZ/İHLAL EDEMEZ**:

1.  **Mapping (DTO-Entity Dönüşümleri):** 
    *   Katmanlar arası (Request -> Entity veya Entity -> Response) tüm dönüşümler ZORUNLU olarak **`ModelMapper`** kullanılarak yapılacaktır.
    *   `entity.setX(dto.getX())` gibi manuel atamalar KESİNLİKLE YASAKTIR (Sadece hesaplanan `totalPrice` veya dışarıdan gelen login `user` gibi özel alanlar elle set edilebilir).
2.  **Business Logic (İş Kuralları) Orkestrasyonu:** 
    *   Veritabanında kayıt var mı kontrolü (`checkIfCarExists`), kuralları doğrulama ve hata fırlatma işlemleri **doğrudan `Manager` katmanında YAZILMAZ.**
    *   Tüm iş kuralları Özel `BusinessRules` (örn: `CarBusinessRules`) sınıflarına delege edilir, The Manager assumes only the role of orchestration.
3.  **Exception Handling (Hata Yönetimi):** 
    *   Java'nın standart `RuntimeException` veya genel `Exception` sınıfları throw edilmez. 
    *   Projenin kendi `BusinessException` sınıfı fırlatılır. Bu hatalar `GlobalExceptionHandler` (ControllerAdvice) tarafından merkezi olarak yakalanıp RFC 7807 (ProblemDetails JSON) standartlarında Frontend'e dönülür.
4.  **Caching (Önbellekleme) Standartları:** 
    *   Global Caching için Redis kullanılmaktadır (`spring.cache.type=redis`).
    *   Redis serileştirme hatalarını (HTTP 500) önlemek adına, Controller katmanından veya Cache'den dönecek olan TÜM `Response` (DTO) sınıflarında **`implements Serializable`** ZORUNLUDUR.
5.  **Environment Security (.env):**
    *   Veritabanı şifreleri, JWT Secret'lar ve Cloudinary API key'leri `application.properties` dosyasında ASLA düz metin olarak barındırılmaz.
    *   Tüm sırlar `${DB_PASSWORD}` formatında okunur ve projenin kök dizinindeki klasörde bulunan `.env` (gitignored) dosyasından beslenir.

---

## 3. Project Structure (Klasör & Paket Mimarisi)
Proje N-Tier (Çok Katmanlı) Mimariye dayanmaktadır ve modüler bir yapısı vardır:

*   **`entities`:** Veritabanı tablolarının JPA (`@Entity`) karşılıkları. *(Araç, Kullanıcı, Kiralama)*
*   **`dataAccess (Repositories)`:** Veritabanı ile konuşan JpaRepository arayüzleri ve özel JPQL sorguları.
*   **`business`:** İş katmanı. Kendi içinde ayrılır:
    *   *`requests` / `responses`:* Frontend'den gelen ve giden DTO'lar.
    *   *`abstracts` / `concretes`:* Servis arayüzleri ve Manager implementasyonları.
    *   *`rules`:* İş kuralları (Var mı? Pasif mi? Kurala uyuyor mu?).
*   **`core`:** Proje bağımsız, her projede kullanılabilecek evrensel altyapılar:
    *   *`utilities/exceptions`:* Global Hata (Exception) yönetimi.
    *   *`utilities/mappers`:* ModelMapper entegrasyonu.
    *   *`security`:* JWT, Encoder ve Security Filter Chain.
*   **`webApi (Controllers)`:** RESTful uç noktalar. Request'leri alır, Business katmanına iletir.

---

## 4. Completed Milestones & History (Proje Tarihçesi)
AI, mevcut kodun neden bu şekilde yazıldığını anlamak için geçmişte alınan pivot kararları bilmelidir:

*   **Milestone 1 (Feature Expansion):** Kiralama (Rental) motoru yazıldı. Çakışan tarihleri önleyen JPQL query'leri eklendi. Araç resimlerini buluta yüklemek için `Cloudinary` entegre edildi. JWT bazlı Security aktif edildi ve ödeme sistemi simülasyonu eklendi.
*   **Milestone 2 (SOLID & Refactoring):** Projedeki kargaşayı (örn: `Manager` içine yazılmış yüzlerce satırlık exception statment'ları) engellemek adına büyük bir SOLID temizliği yapıldı. Tüm işleme logic'leri `BusinessRules` sınıflarına aktarıldı.
*   **Milestone 3 (Security & Resilience - Production Ready):** 
    *   Authentication (Login) uç noktalarına saniyede çok fazla deneme yapılmasını (Brute Force) engellemek için `Resilience4j RateLimiter` entegre edildi.
    *   Sistemde bulunmayan bir e-postayı aratırken dönen sürenin kısalığından faydalanılan "Timing Attack" (Zamanlama Saldırısı) açığını kapatmak için, kullanıcı bulunamadığında da sisteme fake gecikme ekleyen bir şifreleme motoru kurgusu `ApplicationConfig` sınıfına işlendi.
*   **Milestone 4 (Observability):** Spring Boot Actuator ve Logback (Dosya tabanlı günlükleme - File Logging) eklendi.
*   **Milestone 5 (Dockerization):** Uygulamanın Windows/Mac fark etmeksizin aynı çalışabilmesi için `PostgreSQL 16` containerize edildi ve `docker-compose.yml` içine alındı. Spring Boot ise Alpine Linux barındıran multi-stage `Dockerfile` ile optimize edilerek network içine hapsedildi.
*   **Milestone 6 (Redis Global Cache):** RAM tüketimini azaltmak ve hızı küresel boyuta taşımak için mimariye `redis:7-alpine` Docker container'ı eklendi. `application.properties` dosyasına `spring.cache.type=redis` yönlendirmesi yapıldı. Redis Serileştirme (Serialization) sorununu aşmak için tüm Response DTO'larına `Serializable` mühürleri basıldı. 12 GB'lık eski önbellek (cache) ve container çöpü temizlenerek Docker Volumes'in veriyi harici tutma (Persistent Data) mimarisi test edildi.
