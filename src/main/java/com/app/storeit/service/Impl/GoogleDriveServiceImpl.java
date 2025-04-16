package com.app.storeit.service.Impl;

import java.util.List;
import java.util.ArrayList;
import java.util.Collections;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.app.storeit.service.CloudStorageService;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import java.io.IOException;

@Service
public class GoogleDriveServiceImpl implements CloudStorageService {

    private static final String APPLICATION_NAME = "StoreIt";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    private Drive getDriveService() throws IOException {
        GoogleCredentials credentials = GoogleCredentials.fromStream(
                getClass().getClassLoader().getResourceAsStream("storeit-457017-70d5b472c5b6.json"))
                .createScoped(Collections.singletonList("https://www.googleapis.com/auth/drive"));
        return new Drive.Builder(new NetHttpTransport(), JSON_FACTORY, new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
    }

    @Override
    public List<String> listFiles(String provider) {
        try {
            Drive driveService = getDriveService();
            FileList result = driveService.files().list().setPageSize(10).setFields("files(id, name)").execute();
            List<String> fileNames = new ArrayList<>();
            for (File file : result.getFiles()) {
                fileNames.add(file.getName());
            }
            return fileNames;
        } catch (IOException e) {
            throw new RuntimeException("Failed to list files from Google Drive: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadFile(String provider, MultipartFile file) {
        try {
            Drive driveService = getDriveService();
            File fileMetadata = new File();
            fileMetadata.setName(file.getOriginalFilename());

            File uploadedFile = driveService.files().create(fileMetadata,
                    new InputStreamContent(file.getContentType(), file.getInputStream()))
                    .setFields("id")
                    .execute();

            return "File uploaded successfully with ID: " + uploadedFile.getId();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file to Google Drive: " + e.getMessage(), e);
        }
    }
}