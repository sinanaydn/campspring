## SpringBoot anatasyonları 
@EnableCaching 
Spring Boot'a "Hey, ben bu projede önbellek (Cache) mekanizmasını kullanmak istiyorum, sistemini buna göre ayarla" dediğimiz ana şalterdir. Bunu yazmadan diğer anotasyonlar çalışmaz.

@Cacheable(value = "brands_pageable")
"Bu metodun döndürdüğü sonucu brands_pageable adlı bir sandıkta (bellekte) sakla." anlamına gelir. Bir kullanıcı Markaları listelemek istediğinde metot çalışıp veritabanına gider, veriyi sandığa atar. İkinci bir kullanıcı (veya aynı kişi) Markaları bir saniye sonra tekrar istediğinde, kod metodun içine bile girmeden direkt sandıktaki veriyi saniyenin onda biri hızında geri fırlatır

@CacheEvict(value = "brands_pageable", allEntries = true)
 Evict (Kovmak / Boşaltmak) demektir. Yeni bir araba markası eklediğinde veya sildiğinde o anki sandıktaki (cache) veri eskimiş/bayatlamış olur. Eğer sandığı temizlemezsen kullanıcı yeni eklediği markayı listede göremez. Bu anotasyon "Yeni bir veri eklendiğinde brands sandığını tamamen çöpe at" der. Böylece bir sonraki getAll
 metodunda yepyeni ve güncel verilerle sandık tekrar dolar.

 @RateLimiter(name = "api-rate-limiter") (CarsController ve RentalsController): Bunu sınıfın tepesine (Controller) koyduk. Artık o sınıftaki tüm endpointler zırh giydi. Spring Boot şöyle der: "Dur bakalım, saniyede 20 istek limitini aştın mı? Aşmadıysan geç içeri. Aştıysan kodu çalıştırmam ve seni bloklarım.