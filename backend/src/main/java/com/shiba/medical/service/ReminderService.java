package com.shiba.medical.service;

import com.shiba.medical.model.Appointment;
import com.shiba.medical.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {
    private final AppointmentRepository appointmentRepository;

    // Run every hour to check for appointments in the next 24 hours
    // Initial delay of 10 minutes to allow application to fully start and data to be loaded
    @Scheduled(fixedRate = 3600000, initialDelay = 600000) // 1 hour interval, 10 min initial delay
    @Transactional(readOnly = true)
    public void sendAppointmentReminders() {
        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime tomorrow = now.plusHours(24);
            
            // Get all scheduled appointments in the next 24 hours
            List<Appointment> allAppointments = appointmentRepository.findAll();
            List<Appointment> upcomingAppointments = allAppointments.stream()
                .filter(a -> a.getStatus() == Appointment.AppointmentStatus.SCHEDULED)
                .filter(a -> a.getAppointmentDate() != null)
                .filter(a -> a.getAppointmentDate().isAfter(now) && a.getAppointmentDate().isBefore(tomorrow))
                .toList();
            
            // Logging reminders (email/SMS integration pending)
            if (upcomingAppointments.isEmpty()) {
                log.debug("No appointments to remind in the next 24 hours");
                return;
            }
            
            log.info("Found {} appointments to remind", upcomingAppointments.size());
            for (Appointment appointment : upcomingAppointments) {
                try {
                    String phone = appointment.getUser() != null ? appointment.getUser().getPhone() : "Unknown";
                    String doctorName = appointment.getDoctor() != null ? appointment.getDoctor().getName() : "Unknown";
                    log.info("REMINDER: Appointment scheduled for {} with Dr. {} at {}",
                        phone, doctorName, appointment.getAppointmentDate());
                } catch (Exception e) {
                    log.warn("Error processing reminder for appointment {}: {}", appointment.getId(), e.getMessage());
                }
            }
        } catch (Exception e) {
            log.error("Error in reminder service: {}", e.getMessage(), e);
        }
    }
}

