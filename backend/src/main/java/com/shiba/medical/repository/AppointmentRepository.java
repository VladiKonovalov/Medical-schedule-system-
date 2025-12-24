package com.shiba.medical.repository;

import com.shiba.medical.model.Appointment;
import com.shiba.medical.model.Appointment.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByUserId(Long userId);
    List<Appointment> findByUserIdAndStatus(Long userId, AppointmentStatus status);
    List<Appointment> findByUserIdAndAppointmentDateAfter(Long userId, LocalDateTime date);
    List<Appointment> findByUserIdAndAppointmentDateBefore(Long userId, LocalDateTime date);
    List<Appointment> findByDoctorIdAndAppointmentDateBetween(Long doctorId, LocalDateTime start, LocalDateTime end);
    boolean existsByDoctorIdAndAppointmentDateAndStatus(Long doctorId, LocalDateTime appointmentDate, AppointmentStatus status);
}

