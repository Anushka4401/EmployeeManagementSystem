package com.anushka.ems_test.repository;

import com.anushka.ems_test.entity.LoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory,Long> {
    List<LoginHistory> findByUserId(Long userId);
    Page<LoginHistory> findAll(Pageable pageable);

}
