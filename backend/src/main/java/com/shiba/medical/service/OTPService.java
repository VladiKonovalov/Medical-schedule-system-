package com.shiba.medical.service;

import com.shiba.medical.model.OTPCode;
import com.shiba.medical.repository.OTPCodeRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class OTPService {
    private final OTPCodeRepository otpCodeRepository;
    private static final int OTP_EXPIRY_MINUTES = 5;
    private final Random random = new Random();

    @Transactional
    public String generateOTP(String phone) {
        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(1000000));
        
        // Delete old OTPs for this phone
        otpCodeRepository.deleteExpiredCodes(LocalDateTime.now());
        
        // Save new OTP
        OTPCode otpCode = new OTPCode();
        otpCode.setPhone(phone);
        otpCode.setCode(otp);
        otpCode.setExpiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES));
        otpCodeRepository.save(otpCode);
        
        log.info("OTP for phone {}: {}", phone, otp);
        
        return otp;
    }

    @Transactional
    public boolean verifyOTP(String phone, String code) {
        OTPCode otpCode = otpCodeRepository
            .findByPhoneAndCodeAndExpiresAtAfter(phone, code, LocalDateTime.now())
            .orElse(null);
        
        if (otpCode != null) {
            // Delete used OTP
            otpCodeRepository.delete(otpCode);
            return true;
        }
        
        return false;
    }
}

