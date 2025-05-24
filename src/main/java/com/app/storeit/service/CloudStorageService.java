package com.app.storeit.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

public interface CloudStorageService {
    List<String> listFiles(String provider);
    String uploadFile(String provider, MultipartFile file);
    List<String> listPhotos(String provider); // Added method signature
    List<String> listVideos(String provider); // Added method signature
    // Add other methods
}
