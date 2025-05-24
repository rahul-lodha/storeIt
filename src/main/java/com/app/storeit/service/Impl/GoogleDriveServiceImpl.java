package com.app.storeit.service.Impl;

import java.util.List;
import java.util.Arrays;
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
import com.google.api.client.util.StringUtils;

import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@Service
public class GoogleDriveServiceImpl implements CloudStorageService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleDriveServiceImpl.class);

    private static final String APPLICATION_NAME = "StoreIt";
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();

    private Drive getDriveService() throws IOException {
        logger.info("Attempting to get Drive service credentials.");
        try {
            GoogleCredentials credentials = GoogleCredentials.fromStream(
                    getClass().getClassLoader().getResourceAsStream("storeit-457017-70d5b472c5b6.json"))
                    .createScoped(Collections.singletonList("https://www.googleapis.com/auth/drive"));
            logger.info("Google credentials loaded successfully.");
             return new Drive.Builder(new NetHttpTransport(), JSON_FACTORY, new HttpCredentialsAdapter(credentials))
                .setApplicationName(APPLICATION_NAME)
                .build();
        } catch (IOException e) {
            logger.error("Failed to load Google Drive credentials or get Drive service.", e);
            throw e;
        }
    }

     private List<File> listFilesByMimeType(String mimeType) {
        logger.info("Attempting to list files with MIME type: {}", mimeType);
        try {
            Drive driveService = getDriveService();
            String query = "mimeType contains '" + mimeType + "'";
             FileList result = driveService.files().list()
                .setQ(query)
                .setFields("files(id, name, mimeType)")
                .execute();
             logger.info("Successfully listed files with MIME type {}. Found {} files.", mimeType, result.getFiles() != null ? result.getFiles().size() : 0);
             return result.getFiles();
        } catch (IOException e) {
            logger.error("Failed to list files by MIME type from Google Drive: " + e.getMessage(), e);
            throw new RuntimeException("Failed to list files by MIME type from Google Drive: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> listFiles(String provider) {
        logger.info("Attempting to list all files for provider: {}", provider);
         try {
            Drive driveService = getDriveService();
             FileList result = driveService.files().list()
                .setFields("files(id, name, mimeType)")
                .execute();

            List<String> fileNames = new ArrayList<>();
            if (result.getFiles() != null) {
                for (File file : result.getFiles()) {
                    fileNames.add(file.getName());
                }
                logger.info("Successfully listed all files. Found {} files.", fileNames.size());
             } else {
                logger.info("No files found when listing all files.");
                return Collections.emptyList();
            }
            return fileNames;
        } catch (IOException e) {
            logger.error("Failed to list all files from Google Drive: " + e.getMessage(), e);
            throw new RuntimeException("Failed to list files from Google Drive: " + e.getMessage(), e);
        }
    }

    @Override
    public String uploadFile(String provider, MultipartFile file) {
        logger.info("Attempting to upload file for provider: {}", provider);
        try {
            Drive driveService = getDriveService();
            File fileMetadata = new File();
            fileMetadata.setName(file.getOriginalFilename());

            File uploadedFile = driveService.files().create(fileMetadata,
                    new InputStreamContent(file.getContentType(), file.getInputStream()))
                    .setFields("id")
                    .execute();

            logger.info("File uploaded successfully with ID: {}", uploadedFile.getId());
            return "File uploaded successfully with ID: " + uploadedFile.getId();
        } catch (IOException e) {
            logger.error("Failed to upload file to Google Drive: " + e.getMessage(), e);
            throw new RuntimeException("Failed to upload file to Google Drive: " + e.getMessage(), e);
        }
    }

    @Override
    public List<String> listPhotos(String provider) {
        logger.info("Attempting to list photos for provider: {}", provider);
        List<String> fileNames = new ArrayList<>();
         List<File> photos = listFilesByMimeType("image/");

        if (photos != null) {
            for (File photo : photos) {
                fileNames.add(photo.getName());
            }
        }
        logger.info("Finished listing photos. Found {} photo names.", fileNames.size());
        return fileNames;
    }

    @Override
    public List<String> listVideos(String provider) {
        logger.info("Attempting to list videos for provider: {}", provider);
        List<String> fileNames = new ArrayList<>();
        List<File> videos = listFilesByMimeType("video/");
        if (videos != null) {
            for (File video : videos) {
                fileNames.add(video.getName());
            }
        }
        logger.info("Finished listing videos. Found {} video names.", fileNames.size());
        return fileNames;
    }


}