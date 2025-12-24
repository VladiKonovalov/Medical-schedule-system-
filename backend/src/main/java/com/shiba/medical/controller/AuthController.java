package com.shiba.medical.controller;

import com.shiba.medical.dto.AuthResponse;
import com.shiba.medical.dto.OTPResponse;
import com.shiba.medical.dto.SendOTPRequest;
import com.shiba.medical.dto.VerifyOTPRequest;
import com.shiba.medical.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/send-otp")
    public ResponseEntity<OTPResponse> sendOTP(@Valid @RequestBody SendOTPRequest request) {
        OTPResponse response = authService.sendOTP(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<AuthResponse> verifyOTP(@Valid @RequestBody VerifyOTPRequest request) {
        AuthResponse response = authService.verifyOTP(request);
        return ResponseEntity.ok(response);
    }
}

