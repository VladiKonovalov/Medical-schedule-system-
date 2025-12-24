package com.shiba.medical.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(unique = true, nullable = false)
    private String phone;
    
    private String name;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    private Boolean verified = false;
    
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<Appointment> appointments;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}

