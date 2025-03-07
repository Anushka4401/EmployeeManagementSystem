package com.anushka.ems_test.service;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class NotificationServices {
    @Autowired
    private JavaMailSender mailSender;
    public void sendApprovalRequest(String superAdminEmail, String userName, Long userId)  {
        String subject = "New User Approval Request";
        String approvalLink = "http://localhost:8080/admin/"+ userId+"/approve" ;
        String rejectLink = "http://localhost:8080/admin/"+userId+"/deactivate";

        String emailBody = "<h3>User Approval Request</h3>"
                + "<p>User <b>" + userName + "</b> has registered and requires approval.</p>"
                + "<p>Click the link below to approve:</p>"
                + "<a href='" + approvalLink + "' style='color:blue;'>Approve User</a>"
                + "<p>Click the link below to reject:</p>"
                + "<a href='" + rejectLink + "' style='color:blue;'>Reject User</a>";;

        sendEmail(superAdminEmail, subject, emailBody);
    }

    public void sendApproval(String userEmail, String userName)  {
        String subject = "User Approved";
        String loginLink = "http://localhost:8080/auth/login-user";

        String emailBody = "<h3>Request Approved</h3>"
                + "<p>User <b>" + userName + "</b> you have been registered successfully! <br> You can login to account</p>"

                + "<a href='" + loginLink + "' style='color:blue;'>Login here</a>";

        sendEmail(userEmail, subject, emailBody);
    }

    public void sendReject(String userEmail, String userName) throws MessagingException {
        String subject = "User Reject";


        String emailBody = "<h3>Request Approved</h3>"
                + "<p>User <b>" + userName + "</b> you have been deactivated! ";

        sendEmail(userEmail, subject, emailBody);
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);

            mailSender.send(message);

        }
        catch (Exception e){
            System.out.println(e.getMessage());
        }

    }

}