package com.shiba.medical;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MedicalSchedulingApplication {

    public static void main(String[] args) {
        SpringApplication.run(MedicalSchedulingApplication.class, args);
    }
}

