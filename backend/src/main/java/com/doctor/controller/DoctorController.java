package com.doctor.controller;

import com.doctor.dto.ApiResponse;
import com.doctor.dto.LoginRequest;
import com.doctor.dto.LoginResponse;
import com.doctor.entity.Doctor;
import com.doctor.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/doctor")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        Optional<Doctor> doctor = doctorRepository.findByEmailAndPassword(request.getEmail(), request.getPassword());

        if (doctor.isPresent()) {
            LoginResponse response = new LoginResponse(
                    true,
                    "Login successful",
                    "token_" + doctor.get().getId(),
                    doctor.get().getId(),
                    "doctor"
            );
            return ResponseEntity.ok(response);
        }

        return ResponseEntity.ok(new LoginResponse(false, "Invalid credentials", null, null, null));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctor(@PathVariable Integer id) {
        Optional<Doctor> doctor = doctorRepository.findById(id);
        return doctor.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        return ResponseEntity.ok(doctorRepository.findAll());
    }

    // Fixed: now uses a DB-level LIKE query instead of loading all doctors into memory
    @GetMapping("/search/{specialization}")
    public ResponseEntity<List<Doctor>> searchBySpecialization(@PathVariable String specialization) {
        List<Doctor> doctors = doctorRepository.findBySpecializationContainingIgnoreCase(specialization);
        return ResponseEntity.ok(doctors);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse> updateDoctor(@PathVariable Integer id, @RequestBody Doctor doctor) {
        Optional<Doctor> existing = doctorRepository.findById(id);
        if (existing.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        doctor.setId(id);
        Doctor updated = doctorRepository.save(doctor);
        return ResponseEntity.ok(new ApiResponse(true, "Doctor updated successfully", updated, 200));
    }
}
