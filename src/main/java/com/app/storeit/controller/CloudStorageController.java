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

  @GetMapping("/files")
  public List<String> listFiles() {
    return googleDriveService.listFiles("google");
  }

  @GetMapping("/photos")
  public List<String> listPhotos() {
    return googleDriveService.listPhotos("google");
  }

  @GetMapping("/videos")
  public List<String> listVideos() {
    return googleDriveService.listVideos("google");
  }

  @PostMapping("/upload")
  public String uploadFile(@RequestParam("file") MultipartFile file) {
    return googleDriveService.uploadFile("google", file);
  }

}

