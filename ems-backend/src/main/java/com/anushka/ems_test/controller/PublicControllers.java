package com.anushka.ems_test.controller;

import com.amazonaws.services.s3.model.S3Object;
import com.anushka.ems_test.entity.Documents;
import com.anushka.ems_test.entity.Users;
import com.anushka.ems_test.repository.DocumentsRepository;
import com.anushka.ems_test.repository.UserRepository;
import com.anushka.ems_test.service.AdminServices;
import com.anushka.ems_test.service.AuthServices;
import com.anushka.ems_test.service.MessagesServices;
import com.anushka.ems_test.service.S3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.security.Principal;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
public class PublicControllers {
    @Autowired
    private AdminServices adminServices;
    @Autowired
    private AuthServices authServices;


    @Autowired
    private S3Service s3Service;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DocumentsRepository documentsRepository;

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUserDetails(@RequestBody Users user, @PathVariable Long id){

        Users savedUser = adminServices.updateUserDetails(id,user);
        return new ResponseEntity<>(savedUser, HttpStatus.NO_CONTENT);

    }
    @GetMapping()
    public ResponseEntity<?> getUserProfile(@AuthenticationPrincipal UserDetails userDetails){
        String email = userDetails.getUsername();
        Users user = userRepository.findByEmail(email);
        return ResponseEntity.ok(user);

    }
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Users updatedUser
    ) {
        Users updateProfile = authServices.updateProfile(userDetails, updatedUser);
        return ResponseEntity.ok(updateProfile);
    }

    @GetMapping("/admins")
    public ResponseEntity<?> getAllAdmins(){
        return new ResponseEntity<>(userRepository.findAll()
                .stream()
                .filter(user -> "ROLE_ADMIN".equals(user.getRoles().getRole_name()) || "ROLE_SUPER_ADMIN".equals(user.getRoles().getRole_name()))
                .collect(Collectors.toList()),HttpStatus.OK);

    }

    //document related API

//    @GetMapping("/download/{fileName}")
//    public ResponseEntity<?> downloadFile(@PathVariable String fileName, Principal principal) {
//        String name = principal.getName();
//        Users currentUser = userRepository.findByEmail(name);
//
//        Documents documents = documentsRepository.findByFilePath(fileName);
//        if (documents==null){
//            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
//
//        }
//
//        if (currentUser.getRoles().getRole_name().equals("ROLE_ADMIN") ||currentUser.getRoles().getRole_name().equals("ROLE_SUPER_ADMIN") ||documents.getUserId()==currentUser.getId()) {
//            S3Object s3Object = s3Service.downloadFile(fileName);
//            return ResponseEntity.ok()
//                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
//                    .body(s3Object.getObjectContent());
//        }
//        else{
//            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
//        }
//
//    }
@GetMapping("/download/{fileName}")
public ResponseEntity<byte[]> downloadFile(@PathVariable String fileName, Principal principal) throws IOException {
    String name = principal.getName();
    Users currentUser = userRepository.findByEmail(name);

    Documents documents = documentsRepository.findByFilePath(fileName);
    if (documents == null) {
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    if (currentUser.getRoles().getRole_name().equals("ROLE_ADMIN") ||
            currentUser.getRoles().getRole_name().equals("ROLE_SUPER_ADMIN") ||
            documents.getUserId() == currentUser.getId()) {

        S3Object s3Object = s3Service.downloadFile(fileName);
        byte[] fileContent = s3Object.getObjectContent().readAllBytes();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .header(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                .body(fileContent);
    } else {
        return new ResponseEntity<>(HttpStatus.FORBIDDEN);
    }
}
    @GetMapping("/documents")
    public ResponseEntity<List<Map<String, Object>>> getDocuments(Principal principal) {
        String username = principal.getName();
        Users user = userRepository.findByEmail(username);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Collections.emptyList());
        }

        List<Map<String, Object>> response;

        if (user.getRoles().getRole_name().equals("ROLE_ADMIN") || user.getRoles().getRole_name().equals("ROLE_SUPER_ADMIN")) {
            // Admin fetches all documents with user names
            response = adminServices.getAllDocumentsWithUserNames();
        } else {
            // User fetches only their own documents
            List<Documents> userDocs = documentsRepository.findByUserId(user.getId());
            response = userDocs.stream().map(doc -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", doc.getId());
                map.put("filePath", doc.getFilePath());
                map.put("uploadedAt", doc.getUploadedAt());
                map.put("userName", user.getName()); // Since user is fetching their own docs
                return map;
            }).collect(Collectors.toList());
        }

        return ResponseEntity.ok(response);
    }

}
