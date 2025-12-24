package com.shiba.medical.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class SendOTPRequest {
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;
}

