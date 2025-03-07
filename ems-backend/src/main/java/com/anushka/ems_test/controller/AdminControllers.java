package com.anushka.ems_test.controller;

import com.anushka.ems_test.entity.Documents;
import com.anushka.ems_test.entity.LoginHistory;
import com.anushka.ems_test.entity.Roles;
import com.anushka.ems_test.entity.Users;
import com.anushka.ems_test.repository.DocumentsRepository;
import com.anushka.ems_test.repository.RoleRepository;
import com.anushka.ems_test.service.AdminServices;
import com.anushka.ems_test.service.S3Service;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.awt.print.Pageable;
import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminControllers {
    @Autowired
    private AdminServices adminServices;
    @Autowired
    private S3Service s3Service;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private DocumentsRepository documentsRepository;


    //USER RELATED APIS
    @GetMapping("/get-all")
    public Page<Users> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        return adminServices.getAllUsers(page, size);
    }

    @GetMapping("/user-list")
    public List<Users> getUserList(){
        return adminServices.getAllUsersList();
    }




    @PostMapping("/manual-register")
    public ResponseEntity<Users> registerUser(@RequestBody Users users) {
        Users savedUser = adminServices.registerUsersManually(users);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);


    }
    @PutMapping("/{id}")
    public ResponseEntity<Users> updateUserDetails(@PathVariable Long id, @RequestBody Users user) {


        // Save the updated Users entity
        Users savedUser = adminServices.updateUserDetails(id, user);
        return new ResponseEntity<>(savedUser, HttpStatus.OK);

    }
    @GetMapping("/{id}/approve")
    public ResponseEntity<String> approveUser(@PathVariable Long id) throws MessagingException {
        Users savedUser = adminServices.approveUserRequest(id);
        return ResponseEntity.ok("<h2>User Approved Successfully!</h2><p>You can close this window.</p>");
    }

    @GetMapping("/{id}/deactivate")
    public ResponseEntity<String> deactivateUser(@PathVariable Long id) {
        Users savedUser = adminServices.deactivateUser(id);
        return ResponseEntity.ok("<h2>User Deactivated Successfully!</h2><p>You can close this window.</p>");
    }
    @PostMapping("/import-users")
    public ResponseEntity<String> importUsers(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Please upload a valid Excel file.");
        }

        String message = adminServices.importUsersFromExcel(file);
        return ResponseEntity.ok(message);
    }

    //LOGIN HISTORY RELATED API
//    get login of all users
//    @GetMapping("/login-history")
//    public ResponseEntity<List<LoginHistory>> getLoginHistoryAll(){
//        List<LoginHistory> loginHistoryAll = adminServices.getLoginHistoryAll();
//        return new ResponseEntity<>(loginHistoryAll,HttpStatus.OK);
//    }

    @GetMapping("/login-history")
    public Page<LoginHistory> getLoginHistory(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String direction) {
        return adminServices.getLoginHistoryAll(page, size, sortBy, direction);
    }


    //login history by user id
//    @GetMapping("/login-history/{userId}")
//    public ResponseEntity<List<LoginHistory>> getLoginHistoryByUserId(@PathVariable Long userId){
//        List<LoginHistory> loginHistoryForUser = adminServices.getLoginHistoryByUserId(userId);
//        return new ResponseEntity<>(loginHistoryForUser,HttpStatus.OK);
//    }

    //DOCUMENTS RELATED API

    @PostMapping("/upload-file")
    public String uploadFile(@RequestParam("file") MultipartFile file,@RequestParam("userId") Long userId) throws IOException{
        if (file.isEmpty()){
            throw new IllegalArgumentException("File is empty");
        }
        File convFile=File.createTempFile("temp-", file.getOriginalFilename());
        file.transferTo(convFile);
        try {
            String uploadFile = s3Service.uploadFile(convFile);

            Documents documents=new Documents();
            documents.setUserId(userId);
            documents.setFilePath(convFile.getName());
            documents.setUploadedAt(LocalDateTime.now());
            documentsRepository.save(documents);

            return uploadFile;

        }
        finally {
            if (convFile.exists()){
                convFile.delete();
            }
        }


    }







}
