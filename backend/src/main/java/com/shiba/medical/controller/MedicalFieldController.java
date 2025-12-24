package com.shiba.medical.controller;

import com.shiba.medical.model.MedicalField;
import com.shiba.medical.service.MedicalFieldService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medical-fields")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MedicalFieldController {
    private final MedicalFieldService medicalFieldService;

    @GetMapping
    public ResponseEntity<List<MedicalField>> getAllMedicalFields() {
        List<MedicalField> fields = medicalFieldService.getAllMedicalFields();
        // Set doctors to null to avoid circular reference in JSON
        fields.forEach(field -> field.setDoctors(null));
        return ResponseEntity.ok(fields);
    }
}

