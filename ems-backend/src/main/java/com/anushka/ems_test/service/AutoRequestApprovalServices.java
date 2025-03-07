package com.anushka.ems_test.service;

import com.anushka.ems_test.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class AutoRequestApprovalServices {

    @Autowired
    private AdminServices adminServices;


    @Scheduled(cron = "0 38 12 * * *")
    public void autoApprovePendingUsers() {
        System.out.println("Running auto-approval at: " + LocalDateTime.now());

        List<Users> pendingUsers = adminServices.getPendingUsers();
        for (Users user : pendingUsers) {
            adminServices.approveUserRequest(user.getId());
        }

        System.out.println("Auto-approved " + pendingUsers.size() + " users.");
    }
}
