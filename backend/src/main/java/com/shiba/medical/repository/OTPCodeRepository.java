package com.shiba.medical.repository;

import com.shiba.medical.model.OTPCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface OTPCodeRepository extends JpaRepository<OTPCode, Long> {
    Optional<OTPCode> findByPhoneAndCodeAndExpiresAtAfter(String phone, String code, LocalDateTime now);
    
    @Modifying
    @Transactional
    @Query("DELETE FROM OTPCode o WHERE o.expiresAt < :now")
    void deleteExpiredCodes(@Param("now") LocalDateTime now);
}

