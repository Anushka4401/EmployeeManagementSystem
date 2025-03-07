package com.anushka.ems_test.repository;

import com.anushka.ems_test.entity.Documents;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface DocumentsRepository extends JpaRepository<Documents,Long> {
    @Query(value = "SELECT d.id, d.file_path, d.uploaded_at, u.name, d.user_id " +
            "FROM documents d " +
            "JOIN users u ON d.user_id = u.id", nativeQuery = true)
    List<Object[]> findAllDocumentsWithUserNames();
    List<Documents> findByUserId(Long userId);
    Documents findByFilePath(String filePath);
}
