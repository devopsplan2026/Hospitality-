package com.doctor.repository;

import com.doctor.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Integer> {
    Optional<Doctor> findByEmailAndPassword(String email, String password);
    Optional<Doctor> findByEmail(String email);
    // DB-level LIKE query — replaces the in-memory stream filter
    List<Doctor> findBySpecializationContainingIgnoreCase(String specialization);
}
