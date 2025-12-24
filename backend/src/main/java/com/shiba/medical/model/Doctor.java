package com.shiba.medical.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String name;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medical_field_id", nullable = false)
    @JsonIgnoreProperties({"doctors", "hibernateLazyInitializer", "handler"})
    private MedicalField medicalField;
    
    @Column(name = "experience_years")
    private Integer experienceYears;
    
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("doctor")
    private List<Appointment> appointments;
    
    @OneToMany(mappedBy = "doctor", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("doctor")
    private List<TimeSlot> timeSlots;
}

