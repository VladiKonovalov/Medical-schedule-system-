package com.shiba.medical.service;

import com.shiba.medical.model.Doctor;
import com.shiba.medical.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;

    public List<Doctor> getDoctorsByField(Long fieldId) {
        return doctorRepository.findByMedicalFieldId(fieldId);
    }

    public List<Doctor> searchDoctors(String query) {
        return doctorRepository.findByNameContainingIgnoreCase(query);
    }

    public List<Doctor> searchDoctorsByField(Long fieldId, String query) {
        return doctorRepository.findByMedicalFieldIdAndNameContainingIgnoreCase(fieldId, query);
    }
}

