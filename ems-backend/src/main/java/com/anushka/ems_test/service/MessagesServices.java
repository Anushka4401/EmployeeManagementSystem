package com.anushka.ems_test.service;

import com.anushka.ems_test.entity.Messages;
import com.anushka.ems_test.entity.Users;
import com.anushka.ems_test.repository.MessagesRepository;
import com.anushka.ems_test.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MessagesServices {
    @Autowired
    private MessagesRepository messagesRepository;

    @Autowired
    private UserRepository userRepository;
    //send message

    public Messages sendMessage(Long senderId,Long receiverId,String messageContent){
        Optional<Users> sender = userRepository.findById(senderId);
        Optional<Users> receiver = userRepository.findById(receiverId);
        if (sender.isEmpty() || receiver.isEmpty()) {
            throw new RuntimeException("Sender or Receiver not found.");
        }
        String senderRole = sender.get().getRoles().getRole_name();
        String receiverRole = receiver.get().getRoles().getRole_name();

//        if (!receiver.get().getRoles().getRole_name().equals("ROLE_ADMIN") &&
//                !receiver.get().getRoles().getRole_name().equals("ROLE_SUPER_ADMIN")) {
//            throw new RuntimeException("User to user communication not allowed");
//        }
        if (!isAllowed(senderRole, receiverRole)) {
            throw new IllegalStateException("Action not allowed!");
        }

        Messages messages=new Messages();
        messages.setReceiverId(receiverId);
        messages.setSenderId(senderId);
        messages.setMessage(messageContent);
        messages.setSentAt(LocalDateTime.now());
        Messages sentMessage = messagesRepository.save(messages);
        return sentMessage;


    }


    //get Message for User
    public List<Messages> getMessageByUserId(Long userId){
        List<Messages> messagesByUserId = messagesRepository.findMessagesByUserId(userId);
        return messagesByUserId;
    }

    private boolean isAllowed(String senderRole, String receiverRole) {
        boolean isSenderAdmin = senderRole.equals("ROLE_ADMIN") || senderRole.equals("ROLE_SUPER_ADMIN");
        boolean isReceiverAdmin = receiverRole.equals("ROLE_ADMIN") || receiverRole.equals("ROLE_SUPER_ADMIN");
        boolean isSenderUser = senderRole.equals("ROLE_USER");
        boolean isReceiverUser = receiverRole.equals("ROLE_USER");

        return (isSenderAdmin && isReceiverAdmin) || // Both Admin/Super Admin
                (isSenderUser && isReceiverAdmin) ||  // User → Admin/Super Admin
                (isSenderAdmin && isReceiverUser);    // Admin/Super Admin → User
    }
//    public List<Users> getAdminUsers() {
//        return userRepository.findAll()
//                .stream()
//                .filter(user -> "ROLE_ADMIN".equals(user.getRoles().getRole_name()) || "ROLE_SUPER_ADMIN".equals(user.getRoles().getRole_name()))
//                .collect(Collectors.toList());
//    }


}
