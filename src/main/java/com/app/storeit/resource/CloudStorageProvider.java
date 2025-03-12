package com.app.storeit.resource;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.app.storeit.service.CloudStorageService;

@RestController
@RequestMapping("/api/storage")
public class CloudStorageProvider {
     private final CloudStorageService cloudStorageService;

    public CloudStorageProvider(CloudStorageService cloudStorageService) {
        this.cloudStorageService = cloudStorageService;
    }

    @GetMapping("/{provider}/list")
    public ResponseEntity<?> listFiles(@PathVariable String provider) {
        return ResponseEntity.ok(cloudStorageService.listFiles(provider));
    }

    @PostMapping("/{provider}/upload")
    public ResponseEntity<?> uploadFile(
            @PathVariable String provider,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(cloudStorageService.uploadFile(provider, file));
    }

    // Add other endpoints (download, delete, etc.)
}
