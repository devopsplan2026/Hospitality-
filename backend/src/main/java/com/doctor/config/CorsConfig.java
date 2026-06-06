package com.doctor.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig implements WebMvcConfigurer {

    /**
     * Exposed as a Bean so Spring Security's filter chain can reference it directly.
     * This ensures CORS headers are applied at the security layer (before MVC),
     * which is required for preflight OPTIONS requests to pass through.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Allowed origins — add production domain here when deploying
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:3003",
                "http://127.0.0.1:3003"
        ));

        // All HTTP methods including PATCH and OPTIONS (OPTIONS is required for preflight)
        configuration.setAllowedMethods(Arrays.asList(
                "GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"
        ));

        // Allow all headers
        configuration.setAllowedHeaders(List.of("*"));

        // Allow cookies / Authorization headers
        configuration.setAllowCredentials(true);

        // Cache preflight response for 1 hour
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        // Map /** — context-path (/api) is already handled by server config
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
