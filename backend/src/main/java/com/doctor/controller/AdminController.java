package com.doctor.controller;

import com.doctor.dto.LoginRequest;
import com.doctor.dto.LoginResponse;
import com.doctor.entity.Admin;
import com.doctor.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AdminRepository adminRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Optional<Admin> admin = adminRepository.findByEmailAndPassword(request.getEmail(), request.getPassword());

        if (admin.isPresent()) {
            LoginResponse response = new LoginResponse(
                    true,
                    "Admin login successful",
                    "admin_token_" + admin.get().getId(),
                    admin.get().getId(),
                    "admin"
            );
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(new LoginResponse(false, "Invalid admin credentials", null, null, null));
    }
}
