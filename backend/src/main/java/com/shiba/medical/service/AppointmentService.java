package com.shiba.medical.service;

import com.shiba.medical.dto.AppointmentDTO;
import com.shiba.medical.dto.AppointmentRequest;
import com.shiba.medical.model.Appointment;
import com.shiba.medical.model.Doctor;
import com.shiba.medical.model.User;
import com.shiba.medical.repository.AppointmentRepository;
import com.shiba.medical.repository.DoctorRepository;
import com.shiba.medical.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final AppointmentRepository appointmentRepository;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;

    public List<AppointmentDTO> getUserAppointments(Long userId) {
        List<Appointment> appointments = appointmentRepository.findByUserId(userId);
        return appointments.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getUpcomingAppointments(Long userId) {
        List<Appointment> appointments = appointmentRepository.findByUserIdAndAppointmentDateAfter(
            userId, LocalDateTime.now());
        return appointments.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.SCHEDULED)
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<AppointmentDTO> getPastAppointments(Long userId) {
        List<Appointment> appointments = appointmentRepository.findByUserIdAndAppointmentDateBefore(
            userId, LocalDateTime.now());
        return appointments.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public AppointmentDTO createAppointment(Long userId, AppointmentRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
        
        Doctor doctor = doctorRepository.findById(request.getDoctorId())
            .orElseThrow(() -> new RuntimeException("Doctor not found"));
        
        // Check for conflicts
        if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndStatus(
            request.getDoctorId(), request.getAppointmentDate(), Appointment.AppointmentStatus.SCHEDULED)) {
            throw new RuntimeException("Time slot is already booked");
        }
        
        // Check if appointment is in the past
        if (request.getAppointmentDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot book appointment in the past");
        }
        
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setNotes(request.getNotes());
        appointment.setStatus(Appointment.AppointmentStatus.SCHEDULED);
        
        appointment = appointmentRepository.save(appointment);
        return convertToDTO(appointment);
    }

    @Transactional
    public AppointmentDTO cancelAppointment(Long userId, Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (!appointment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        appointment.setStatus(Appointment.AppointmentStatus.CANCELLED);
        appointment = appointmentRepository.save(appointment);
        return convertToDTO(appointment);
    }

    @Transactional
    public AppointmentDTO rescheduleAppointment(Long userId, Long appointmentId, LocalDateTime newDate) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
            .orElseThrow(() -> new RuntimeException("Appointment not found"));
        
        if (!appointment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }
        
        // Check for conflicts with new date
        if (appointmentRepository.existsByDoctorIdAndAppointmentDateAndStatus(
            appointment.getDoctor().getId(), newDate, Appointment.AppointmentStatus.SCHEDULED)) {
            throw new RuntimeException("Time slot is already booked");
        }
        
        // Check if new date is in the past
        if (newDate.isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Cannot reschedule to a past date");
        }
        
        appointment.setAppointmentDate(newDate);
        appointment.setStatus(Appointment.AppointmentStatus.RESCHEDULED);
        appointment = appointmentRepository.save(appointment);
        return convertToDTO(appointment);
    }

    private AppointmentDTO convertToDTO(Appointment appointment) {
        return new AppointmentDTO(
            appointment.getId(),
            appointment.getDoctor().getId(),
            appointment.getDoctor().getName(),
            appointment.getDoctor().getMedicalField().getId(),
            appointment.getDoctor().getMedicalField().getName(),
            appointment.getAppointmentDate(),
            appointment.getStatus(),
            appointment.getNotes(),
            appointment.getCreatedAt()
        );
    }
}

