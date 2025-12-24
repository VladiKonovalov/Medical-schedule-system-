package com.shiba.medical.config;

import com.shiba.medical.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            chain.doFilter(request, response);
            return;
        }

        try {
            final String jwt = authHeader.substring(7);
            final String phone = jwtUtil.getPhoneFromToken(jwt);
            final Long userId = jwtUtil.getUserIdFromToken(jwt);

            if (phone != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                if (jwtUtil.validateToken(jwt, phone)) {
                    Map<String, Object> details = new HashMap<>();
                    details.put("userId", userId);
                    details.put("phone", phone);
                    
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            phone, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
                    authToken.setDetails(details);
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }

        chain.doFilter(request, response);
    }
}

