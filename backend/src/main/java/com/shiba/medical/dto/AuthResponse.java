package com.shiba.medical.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private UserDTO user;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UserDTO {
        private Long id;
        private String phone;
        private String name;
        private Boolean verified;
    }
}

