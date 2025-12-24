package com.shiba.medical.controller;

import com.shiba.medical.model.Doctor;
import com.shiba.medical.model.MedicalField;
import com.shiba.medical.service.DoctorService;
import com.shiba.medical.service.MedicalFieldService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SearchController {
    private final DoctorService doctorService;
    private final MedicalFieldService medicalFieldService;

    @GetMapping
    public ResponseEntity<SearchResponse> search(@RequestParam String q) {
        List<Doctor> doctors = doctorService.searchDoctors(q);
        List<MedicalField> fields = medicalFieldService.searchMedicalFields(q);
        
        // Break circular references
        doctors.forEach(doctor -> {
            if (doctor.getMedicalField() != null) {
                doctor.getMedicalField().setDoctors(null);
            }
            doctor.setAppointments(null);
            doctor.setTimeSlots(null);
        });
        fields.forEach(field -> field.setDoctors(null));
        
        return ResponseEntity.ok(new SearchResponse(doctors, fields));
    }

    @Data
    @RequiredArgsConstructor
    public static class SearchResponse {
        private final List<Doctor> doctors;
        private final List<MedicalField> medicalFields;
    }
}

