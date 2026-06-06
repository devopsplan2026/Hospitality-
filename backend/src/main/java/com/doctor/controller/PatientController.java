package com.doctor.controller;

import com.doctor.dto.ApiResponse;
import com.doctor.dto.LoginRequest;
import com.doctor.dto.LoginResponse;
import com.doctor.entity.Patient;
import com.doctor.repository.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/patient")
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Optional<Patient> patient = patientRepository.findByEmailAndPassword(request.getEmail(), request.getPassword());

        if (patient.isPresent()) {
            LoginResponse response = new LoginResponse(
                    true,
                    "Login successful",
                    "token_" + patient.get().getId(),
                    patient.get().getId(),
                    "patient"
            );
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(new LoginResponse(false, "Invalid credentials", null, null, null));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(@RequestBody Patient patient) {
        if (patientRepository.findByEmail(patient.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "Email already registered"));
        }

        Patient savedPatient = patientRepository.save(patient);
        return ResponseEntity.ok(new ApiResponse(true, "Registration successful", savedPatient, 200));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable Integer id) {
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Fixed: patient.setId(id) was missing — previously created a duplicate record instead of updating
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updatePatient(@PathVariable Integer id, @RequestBody Patient patient) {
        Optional<Patient> existing = patientRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        patient.setId(id);
        Patient updated = patientRepository.save(patient);
        return ResponseEntity.ok(new ApiResponse(true, "Patient updated successfully", updated, 200));
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientRepository.findAll());
    }
}
