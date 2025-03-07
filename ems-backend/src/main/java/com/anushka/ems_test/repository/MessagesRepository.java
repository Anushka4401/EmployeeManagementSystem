package com.anushka.ems_test.repository;

import com.anushka.ems_test.entity.Messages;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface MessagesRepository extends JpaRepository<Messages,Long> {
    List<Messages> findBySenderIdOrReceiverId(Long senderId, Long receiverId);
    List<Messages> findByReceiverId(Long receiverId);
    @Query("SELECT m FROM Messages m WHERE m.senderId = :userId OR m.receiverId = :userId ORDER BY m.sentAt DESC")
    List<Messages> findMessagesByUserId(Long userId);

}
