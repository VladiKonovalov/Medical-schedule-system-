package com.shiba.medical.service;

import com.shiba.medical.dto.AuthResponse;
import com.shiba.medical.dto.OTPResponse;
import com.shiba.medical.dto.SendOTPRequest;
import com.shiba.medical.dto.VerifyOTPRequest;
import com.shiba.medical.model.User;
import com.shiba.medical.repository.UserRepository;
import com.shiba.medical.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final OTPService otpService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    public OTPResponse sendOTP(SendOTPRequest request) {
        String otp = otpService.generateOTP(request.getPhone());
        return new OTPResponse("OTP sent successfully.", otp);
    }

    @Transactional
    public AuthResponse verifyOTP(VerifyOTPRequest request) {
        boolean isValid = otpService.verifyOTP(request.getPhone(), request.getCode());
        
        if (!isValid) {
            throw new RuntimeException("Invalid or expired OTP");
        }
        
        // Get or create user
        User user = userRepository.findByPhone(request.getPhone())
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setPhone(request.getPhone());
                newUser.setVerified(true);
                return userRepository.save(newUser);
            });
        
        if (!user.getVerified()) {
            user.setVerified(true);
            user = userRepository.save(user);
        }
        
        // Generate JWT token
        String token = jwtUtil.generateToken(user.getId(), user.getPhone());
        
        // Build response
        AuthResponse.UserDTO userDTO = new AuthResponse.UserDTO(
            user.getId(),
            user.getPhone(),
            user.getName(),
            user.getVerified()
        );
        
        return new AuthResponse(token, userDTO);
    }
}

