package com.app.storeit.service.Impl;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.storeit.service.CloudStorageService;

@Service
public class GoogleDriveServiceImpl implements CloudStorageService {

    @Override
    public List<String> listFiles(String provider) {
        // Implement Google Drive API integration
        return List.of("file1.txt", "file2.jpg");
    }

    @Override
    public String uploadFile(String provider, MultipartFile file) {
        // Implement Google Drive upload logic
        return "File uploaded successfully to Google Drive";
    }
}