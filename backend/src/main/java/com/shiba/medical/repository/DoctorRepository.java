package com.shiba.medical.repository;

import com.shiba.medical.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByMedicalFieldId(Long medicalFieldId);
    List<Doctor> findByNameContainingIgnoreCase(String name);
    List<Doctor> findByMedicalFieldIdAndNameContainingIgnoreCase(Long medicalFieldId, String name);
}

