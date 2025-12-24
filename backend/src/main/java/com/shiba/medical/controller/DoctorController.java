package com.shiba.medical.controller;

import com.shiba.medical.model.Doctor;
import com.shiba.medical.service.DoctorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctors")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorController {
    private final DoctorService doctorService;

    @GetMapping
    public ResponseEntity<List<Doctor>> getDoctors(@RequestParam(required = false) Long fieldId) {
        List<Doctor> doctors;
        if (fieldId != null) {
            doctors = doctorService.getDoctorsByField(fieldId);
        } else {
            doctors = doctorService.searchDoctors("");
        }
        // Set nested collections to null to avoid circular reference
        doctors.forEach(doctor -> {
            if (doctor.getMedicalField() != null) {
                doctor.getMedicalField().setDoctors(null);
            }
            doctor.setAppointments(null);
            doctor.setTimeSlots(null);
        });
        return ResponseEntity.ok(doctors);
    }
}

