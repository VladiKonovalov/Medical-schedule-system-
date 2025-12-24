package com.shiba.medical.config;

import com.shiba.medical.repository.MedicalFieldRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializationLogger implements CommandLineRunner {
    private final MedicalFieldRepository medicalFieldRepository;

    @Override
    public void run(String... args) {
        long fieldCount = medicalFieldRepository.count();
        log.info("========================================");
        log.info("Data initialization check:");
        log.info("Medical Fields loaded: {}", fieldCount);
        if (fieldCount > 0) {
            log.info("✓ Data.sql executed successfully");
        } else {
            log.warn("⚠ No medical fields found - data.sql may not have executed");
        }
        log.info("========================================");
    }
}

