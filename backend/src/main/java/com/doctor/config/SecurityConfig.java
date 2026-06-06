package com.doctor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource) {
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Enable CORS at the security filter level — this is what fixes the preflight issue
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                // Disable CSRF — this is a stateless REST API
                .csrf(csrf -> csrf.disable())
                // Permit all requests (app uses its own token logic, not Spring Security auth)
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )
                // Stateless sessions — no JSESSIONID cookie
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                );

        return http.build();
    }
}
