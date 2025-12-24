package com.shiba.medical.controller;

import com.shiba.medical.dto.AppointmentDTO;
import com.shiba.medical.dto.AppointmentRequest;
import com.shiba.medical.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {
    private final AppointmentService appointmentService;

    private Long getUserIdFromAuth(Authentication authentication) {
        if (authentication != null && authentication.getDetails() instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, Object> details = (Map<String, Object>) authentication.getDetails();
            return (Long) details.get("userId");
        }
        throw new RuntimeException("User not authenticated");
    }

    @GetMapping
    public ResponseEntity<List<AppointmentDTO>> getUserAppointments(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(appointmentService.getUserAppointments(userId));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<AppointmentDTO>> getUpcomingAppointments(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(appointmentService.getUpcomingAppointments(userId));
    }

    @GetMapping("/past")
    public ResponseEntity<List<AppointmentDTO>> getPastAppointments(Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(appointmentService.getPastAppointments(userId));
    }

    @PostMapping
    public ResponseEntity<AppointmentDTO> createAppointment(
            @Valid @RequestBody AppointmentRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(appointmentService.createAppointment(userId, request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<AppointmentDTO> cancelAppointment(
            @PathVariable Long id,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(appointmentService.cancelAppointment(userId, id));
    }

    @PutMapping("/{id}/reschedule")
    public ResponseEntity<AppointmentDTO> rescheduleAppointment(
            @PathVariable Long id,
            @RequestBody RescheduleRequest request,
            Authentication authentication) {
        Long userId = getUserIdFromAuth(authentication);
        return ResponseEntity.ok(appointmentService.rescheduleAppointment(userId, id, request.getNewDate()));
    }

    @lombok.Data
    @lombok.NoArgsConstructor
    @lombok.AllArgsConstructor
    public static class RescheduleRequest {
        private LocalDateTime newDate;
    }
}

