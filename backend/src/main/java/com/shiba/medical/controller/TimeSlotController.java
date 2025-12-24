package com.shiba.medical.controller;

import com.shiba.medical.service.TimeSlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/api/time-slots")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TimeSlotController {
    private final TimeSlotService timeSlotService;

    @GetMapping
    public ResponseEntity<List<LocalTime>> getAvailableTimeSlots(
            @RequestParam Long doctorId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(timeSlotService.getAvailableTimeSlots(doctorId, date));
    }
}

