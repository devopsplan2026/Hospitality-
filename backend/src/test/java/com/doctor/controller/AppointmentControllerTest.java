package com.doctor.controller;

import com.doctor.entity.Appointment;
import com.doctor.repository.AppointmentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AppointmentControllerTest {

    private AppointmentController controller;
    private AppointmentRepository appointmentRepository;

    @BeforeEach
    void setUp() {
        appointmentRepository = mock(AppointmentRepository.class);
        controller = new AppointmentController(appointmentRepository);
    }

    @Test
    void shouldRejectAppointmentWhenRequiredFieldsAreMissing() {
        Appointment appointment = new Appointment();
        appointment.setReason("Fever");

        var response = controller.bookAppointment(appointment);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        verify(appointmentRepository, never()).save(any(Appointment.class));
    }
}
