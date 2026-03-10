package com.sinan.rentACar.core.utilities.services.cloudinary;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

@Service
public class CloudinaryImageManager implements ImageService {

    private final Cloudinary cloudinary;

    public CloudinaryImageManager(
            @Value("${cloudinary.cloud_name}") String cloudName,
            @Value("${cloudinary.api_key}") String apiKey,
            @Value("${cloudinary.api_secret}") String apiSecret) {
        
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", true));
    }

    @Override
    public String upload(MultipartFile multipartFile) throws IOException {
        String publicId = UUID.randomUUID().toString();
        // Dosyayı byte[] olarak Cloudinary sunucusuna yollarız ve Cloudinary o resme kalıcı bir Link (URL) verir.
        Map<?, ?> uploadResult = cloudinary.uploader().upload(multipartFile.getBytes(), ObjectUtils.asMap(
                "public_id", publicId
        ));
        return uploadResult.get("url").toString();
    }

    @Override
    public void delete(String imageUrl) throws IOException {
        // İleride araba silinirken resmini de buluttan kaldırmak istersen kullanılabilir.
        
        // Bu versiyonda gerekli olmayacak ama arayüz gerekliliği.
    }
}
