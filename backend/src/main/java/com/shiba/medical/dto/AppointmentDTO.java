package com.shiba.medical.dto;

import com.shiba.medical.model.Appointment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentDTO {
    private Long id;
    private Long doctorId;
    private String doctorName;
    private Long medicalFieldId;
    private String medicalFieldName;
    private LocalDateTime appointmentDate;
    private Appointment.AppointmentStatus status;
    private String notes;
    private LocalDateTime createdAt;
}

