package com.shiba.medical.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AppointmentRequest {
    @NotNull(message = "Doctor ID is required")
    private Long doctorId;
    
    @NotNull(message = "Appointment date is required")
    private LocalDateTime appointmentDate;
    
    private String notes;
}

