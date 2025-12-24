package com.shiba.medical.repository;

import com.shiba.medical.model.MedicalField;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MedicalFieldRepository extends JpaRepository<MedicalField, Long> {
    List<MedicalField> findByNameContainingIgnoreCase(String name);
}

