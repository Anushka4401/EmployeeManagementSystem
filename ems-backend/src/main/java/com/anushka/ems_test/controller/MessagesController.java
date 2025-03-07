package com.anushka.ems_test.controller;

import com.anushka.ems_test.entity.Messages;
import com.anushka.ems_test.service.MessagesServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/message")
public class MessagesController {
    @Autowired
    private MessagesServices messagesServices;

    @PostMapping("/send")
    public ResponseEntity<Messages> sendMessage(@RequestBody Messages messageToSend) {
        return ResponseEntity.ok(messagesServices.sendMessage(messageToSend.getSenderId(), messageToSend.getReceiverId(), messageToSend.getMessage()));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Messages>> getMessageforUserById(@PathVariable Long userId){
        return ResponseEntity.ok(messagesServices.getMessageByUserId(userId));
    }


}
