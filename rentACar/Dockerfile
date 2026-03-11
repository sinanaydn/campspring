# 1. Aşama: Uygulamayı Derleme (Build Stage)
# Java 25 destekleyen resmi Eclipse Temurin imajını kullanıyoruz
FROM eclipse-temurin:25-jdk-alpine AS build

# Maven'ı Alpine Linux üzerine kur (Mevcut imajda bazen maven gelmeyebiliyor)
RUN apk add --no-cache maven

# Çalışma dizinini ayarla
WORKDIR /app

# Sadece POM dosyasını kopyalayarak bağımlılıkları indir (Cache avantajı)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Projenin kaynak kodlarını kopyala ve derle (Testleri bu aşamada atlıyoruz)
COPY src ./src
RUN mvn clean package -DskipTests

# 2. Aşama: Uygulamayı Çalıştırma (Runtime Stage)
# Son imaj boyutunu küçültmek için JDK (Geliştirme kiti) yerine sadece JRE (Çalıştırma kiti) içeren imajı alıyoruz
FROM eclipse-temurin:25-jre-alpine

WORKDIR /app

# İlk aşamada (build) oluşan .jar dosyasını bu asıl ve hafif konteynerin içine kopyalıyoruz
COPY --from=build /app/target/rentACar-0.0.1-SNAPSHOT.jar app.jar

# Uygulamanın çalışacağı port
EXPOSE 8080

# Konteyner ayağa kalktığında çalıştırılacak komut (java -jar app.jar)
ENTRYPOINT ["java", "-jar", "app.jar"]
