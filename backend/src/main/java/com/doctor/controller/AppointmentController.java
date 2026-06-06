package com.doctor.controller;

import com.doctor.dto.ApiResponse;
import com.doctor.dto.StatusUpdateRequest;
import com.doctor.entity.Appointment;
import com.doctor.repository.AppointmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PostMapping
    public ResponseEntity<ApiResponse> bookAppointment(@RequestBody Appointment appointment) {
        appointment.setStatus("pending");
        Appointment saved = appointmentRepository.save(appointment);
        return ResponseEntity.ok(new ApiResponse(true, "Appointment booked successfully", saved, 200));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Appointment> getAppointment(@PathVariable Integer id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        return appointment.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getPatientAppointments(@PathVariable Integer patientId) {
        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getDoctorAppointments(@PathVariable Integer doctorId) {
        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return ResponseEntity.ok(appointments);
    }

    // Fixed: accepts a proper DTO instead of a raw String body (which included quotes)
    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse> updateStatus(@PathVariable Integer id, @RequestBody StatusUpdateRequest request) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Appointment apt = appointment.get();
        apt.setStatus(request.getStatus());
        appointmentRepository.save(apt);
        return ResponseEntity.ok(new ApiResponse(true, "Status updated successfully", apt, 200));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> cancelAppointment(@PathVariable Integer id) {
        Optional<Appointment> appointment = appointmentRepository.findById(id);
        if (appointment.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        appointmentRepository.deleteById(id);
        return ResponseEntity.ok(new ApiResponse(true, "Appointment cancelled successfully", null, 200));
    }

    @GetMapping
    public ResponseEntity<List<Appointment>> getAllAppointments() {
        return ResponseEntity.ok(appointmentRepository.findAll());
    }
}
