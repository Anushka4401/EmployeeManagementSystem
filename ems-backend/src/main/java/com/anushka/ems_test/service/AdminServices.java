package com.anushka.ems_test.service;

import com.anushka.ems_test.entity.LoginHistory;
import com.anushka.ems_test.entity.Roles;
import com.anushka.ems_test.entity.Users;
import com.anushka.ems_test.repository.DocumentsRepository;
import com.anushka.ems_test.repository.LoginHistoryRepository;
import com.anushka.ems_test.repository.RoleRepository;
import com.anushka.ems_test.repository.UserRepository;
import jakarta.mail.MessagingException;
import org.apache.catalina.User;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class AdminServices {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private DocumentsRepository documentsRepository;
    @Autowired
    private LoginHistoryRepository loginHistoryRepository;
    @Autowired
    private NotificationServices notificationServices;
    @Autowired
    private AuthServices authServices;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public AdminServices(BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }


    public Page<Users> getAllUsers(int page, int size) {
        return userRepository.findAll(PageRequest.of(page, size)); // Apply Pagination
    }
    public List<Users> getAllUsersList(){
        return userRepository.findAll();
    }

    public Users updateUserDetails(Long id, Users updatedUser) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (updatedUser.getRoles() == null || updatedUser.getRoles().getId() == null) {
            throw new RuntimeException("Role cannot be null");
        }
        Roles role = roleRepository.findById(updatedUser.getRoles().getId())
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.setName(updatedUser.getName());
        user.setRoles(role);
        user.setStatus(updatedUser.getStatus());
        Users savedUser = userRepository.save(user);
        return savedUser;

    }

    public Users deactivateUser(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setStatus(false);

        Users savedUser = userRepository.save(user);
        try {
            notificationServices.sendReject(user.getEmail(), user.getName());
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }

        return savedUser;


    }

    public Users approveUserRequest(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        user.setStatus(true);

        Users savedUser = userRepository.save(user);
//        notificationServices.sendEmail(user.getEmail(), "Registration approved", "Your account has been activated");
        notificationServices.sendApproval(user.getEmail(), user.getName());
        return savedUser;


    }

public Page<LoginHistory> getLoginHistoryAll(int page, int size, String sortBy, String direction) {
    Sort sort = direction.equalsIgnoreCase("desc") ? Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
    Pageable pageable = PageRequest.of(page, size, sort);
    return loginHistoryRepository.findAll(pageable);
}



//    public List<LoginHistory> getLoginHistoryByUserId(Long userId) {
//        List<LoginHistory> loginHistoryByUserId = loginHistoryRepository.findByUserId(userId);
//        return loginHistoryByUserId;
//    }

    public List<Users> getPendingUsers() {
        List<Users> usersList = userRepository.findByStatus(false);
        return usersList;
    }
    public Users registerUsersManually(Users user) {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        Roles roles = new Roles();
        roles.setId(3L);
        user.setRoles(roles);
        Users savedUser = userRepository.save(user);
        Users approvedUserRequest = approveUserRequest(savedUser.getId());

        return approvedUserRequest;

    }

    public String importUsersFromExcel(MultipartFile file) {
        List<Users> importedUsers = new ArrayList<>();
        List<String> skippedUsers = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);

            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Skip header row

                try {
                    Cell nameCell = row.getCell(0);
                    Cell emailCell = row.getCell(1);
                    Cell passwordCell = row.getCell(2);

                    if (nameCell == null || emailCell == null || passwordCell == null) {
                        skippedUsers.add("Row " + row.getRowNum() + ": Missing required data.");
                        continue;
                    }

                    String email = getCellValueAsString(emailCell).trim();
                    String name = getCellValueAsString(nameCell).trim();
                    String password = getCellValueAsString(passwordCell).trim();

                    // Check if email already exists
                    if (userRepository.findByEmail(email)!=null) {
                        skippedUsers.add(email);
                        System.out.println("Skipping row " + row.getRowNum() + " as email " + email + " already exists.");
                        continue;
                    }

                    // Assign default role
                    Roles role = new Roles();
                    role.setId(3L);

                    // Create user object without using builder
                    Users user = new Users();
                    user.setName(name);
                    user.setEmail(email);
                    user.setPassword(bCryptPasswordEncoder.encode(password)); // Hash password
                    user.setStatus(true);
                    user.setRoles(role);

                    importedUsers.add(user);
                } catch (Exception rowException) {
                    skippedUsers.add("Row " + row.getRowNum() + ": Error processing row.");
                    rowException.printStackTrace();
                }
            }

            // Save all imported users
            if (!importedUsers.isEmpty()) {
                userRepository.saveAll(importedUsers);

                // Send approval email to each user
                for (Users user : importedUsers) {
                    notificationServices.sendApproval(user.getEmail(), user.getName());
                }
            }

            // Build response message
            StringBuilder message = new StringBuilder();
            if (importedUsers.isEmpty()) {
                message.append("No new users were imported. All emails already exist.");
            } else {
                message.append("Users imported successfully.");
            }

            if (!skippedUsers.isEmpty()) {
                message.append(" However, the following emails already exist: ").append(String.join(", ", skippedUsers));
            }

            return message.toString();
        } catch (Exception e) {
            e.printStackTrace();
            return "Failed to import users: " + e.getMessage();
        }
    }

    // Prepare response



    private String getCellValueAsString(Cell cell) {
        if (cell == null) {
            return ""; // Return empty string for null cells
        }
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }



    //s3
    public List<Map<String, Object>> getAllDocumentsWithUserNames() {
        List<Object[]> results = documentsRepository.findAllDocumentsWithUserNames();

        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", ((Number) obj[0]).longValue());
            map.put("filePath", (String) obj[1]);
            Timestamp timestamp = (Timestamp) obj[2];
            LocalDateTime uploadedAt = timestamp.toLocalDateTime();
            map.put("uploadedAt", uploadedAt);

            map.put("userName", (String) obj[3]);
            return map;
        }).collect(Collectors.toList());
    }





}

