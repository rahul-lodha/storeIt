package com.app.storeit.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import com.app.storeit.service.CloudStorageService;

import java.util.List;
import java.util.Map;
import java.util.Collections;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private CloudStorageService googleDriveService;

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardData() {
        // Simulated data for now
        return Map.of(
            "totalUsers", 100,
            "regions", List.of("North America", "Europe", "Asia"),
            "storageUsage", List.of(
                Map.of("provider", "Google Drive", "users", 40),
                Map.of("provider", "Dropbox", "users", 30),
                Map.of("provider", "OneDrive", "users", 30)
            )
        );
    }
}