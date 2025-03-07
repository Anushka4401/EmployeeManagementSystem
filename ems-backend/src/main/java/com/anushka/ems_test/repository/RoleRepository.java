package com.anushka.ems_test.repository;

import com.anushka.ems_test.entity.Roles;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Roles,Long> {
}
