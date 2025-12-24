package com.shiba.medical.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.datatype.jsr310.deser.LocalDateTimeDeserializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class JacksonConfig {

    // Accept format: "yyyy-MM-ddTHH:mm:ss" (e.g., "2024-12-25T14:30:00")
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    @Bean
    @Primary
    public ObjectMapper objectMapper(Jackson2ObjectMapperBuilder builder) {
        JavaTimeModule javaTimeModule = new JavaTimeModule();
        
        // Custom deserializer that handles LocalDateTime without timezone conversion
        javaTimeModule.addDeserializer(LocalDateTime.class, new LocalDateTimeDeserializer(DATETIME_FORMATTER));
        
        return builder
                .modules(javaTimeModule)
                .build();
    }
}
