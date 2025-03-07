package com.anushka.ems_test.service;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;

@Service
public class S3Service {
    private final AmazonS3 amazonS3;

    @Value("${aws.s3.bucketName}")
    private String bucketName;

    public S3Service(AmazonS3 amazonS3) {
        this.amazonS3 = amazonS3;
    }


    public String uploadFile(File file){

        try {
            amazonS3.putObject(new PutObjectRequest(bucketName,file.getName(),file));
            return "File uploaded successfully: "+file.getName();
        }
        catch (Exception e){
            e.printStackTrace();
            return "Error uploading file";
        }

    }

    public S3Object downloadFile(String fileName){
        return amazonS3.getObject(bucketName,fileName);
    }
}
