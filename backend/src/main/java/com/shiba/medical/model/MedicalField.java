package com.shiba.medical.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "medical_fields")
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class MedicalField {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @OneToMany(mappedBy = "medicalField", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonIgnoreProperties("medicalField")
    private List<Doctor> doctors;
}

