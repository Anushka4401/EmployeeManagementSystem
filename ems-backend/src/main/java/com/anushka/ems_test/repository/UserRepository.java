package com.anushka.ems_test.repository;

import com.anushka.ems_test.entity.Users;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserRepository extends JpaRepository<Users,Long> {
    Users findByEmail(String email);
    Page<Users> findAll(Pageable pageable);
    List<Users> findAll();
    List<Users> findByStatus(boolean status);
}
