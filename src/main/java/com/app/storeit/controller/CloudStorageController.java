package com.app.storeit.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.beans.factory.annotation.Autowired;
import com.app.storeit.service.CloudStorageService;

import java.util.List;

@RestController
@RequestMapping("/cloud-storage")
public class CloudStorageController {

    @Autowired
    private CloudStorageService googleDriveService;

    @GetMapping("/google-drive/files")
    public List<String> listGoogleDriveFiles() {
        return googleDriveService.listFiles("google");
    }

    @PostMapping("/google-drive/upload")
    public String uploadFileToGoogleDrive(@RequestParam("file") MultipartFile file) {
        return googleDriveService.uploadFile("google", file);
    }
}