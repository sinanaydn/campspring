package com.sinan.rentACar.core.utilities.services.cloudinary;

import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;

public interface ImageService {
    String upload(MultipartFile multipartFile) throws IOException;
    void delete(String imageUrl) throws IOException;
}
