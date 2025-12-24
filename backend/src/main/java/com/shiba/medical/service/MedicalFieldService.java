package com.shiba.medical.service;

import com.shiba.medical.model.MedicalField;
import com.shiba.medical.repository.MedicalFieldRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalFieldService {
    private final MedicalFieldRepository medicalFieldRepository;

    public List<MedicalField> getAllMedicalFields() {
        return medicalFieldRepository.findAll();
    }

    public List<MedicalField> searchMedicalFields(String query) {
        return medicalFieldRepository.findByNameContainingIgnoreCase(query);
    }
}

