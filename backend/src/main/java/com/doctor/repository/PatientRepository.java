package com.doctor.repository;

import com.doctor.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientRepository extends JpaRepository<Patient, Integer> {
    Optional<Patient> findByEmailAndPassword(String email, String password);
    Optional<Patient> findByEmail(String email);
}
