package com.shiba.medical.service;

import com.shiba.medical.model.Appointment;
import com.shiba.medical.model.TimeSlot;
import com.shiba.medical.repository.AppointmentRepository;
import com.shiba.medical.repository.TimeSlotRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotService {
    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentRepository appointmentRepository;

    public List<LocalTime> getAvailableTimeSlots(Long doctorId, LocalDate date) {
        // Get all time slots for the doctor
        List<TimeSlot> allSlots = timeSlotRepository.findByDoctorId(doctorId);
        
        // Get booked appointments for the doctor on this date
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        List<Appointment> bookedAppointments = appointmentRepository.findByDoctorIdAndAppointmentDateBetween(
            doctorId, startOfDay, endOfDay);
        
        // Filter out booked slots
        List<LocalTime> bookedTimes = bookedAppointments.stream()
            .filter(a -> a.getStatus() == Appointment.AppointmentStatus.SCHEDULED 
                      || a.getStatus() == Appointment.AppointmentStatus.RESCHEDULED)
            .map(a -> a.getAppointmentDate().toLocalTime())
            .collect(Collectors.toList());
        
        // Return available slots
        return allSlots.stream()
            .filter(TimeSlot::getIsAvailable)
            .map(TimeSlot::getStartTime)
            .filter(time -> !bookedTimes.contains(time))
            .sorted()
            .collect(Collectors.toList());
    }
}

