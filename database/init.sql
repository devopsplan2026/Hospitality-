-- Doctor Appointment System Database Schema

USE doctor_appointment;

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create doctor table
CREATE TABLE IF NOT EXISTS doctor (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  specialization VARCHAR(100),
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  availability VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(email)
);

-- Create patient table
CREATE TABLE IF NOT EXISTS patient (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(15),
  age INT,
  gender VARCHAR(10),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX(email)
);

-- Create appointment table
CREATE TABLE IF NOT EXISTS appointment (
  id INT PRIMARY KEY AUTO_INCREMENT,
  patient_id INT NOT NULL,
  doctor_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  reason TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient(id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctor(id) ON DELETE CASCADE,
  INDEX(patient_id, doctor_id, appointment_date)
);

-- Create default admin account
INSERT INTO admin (email, password) VALUES ('admin@example.com', 'admin123');

-- Create sample doctors
INSERT INTO doctor (name, specialization, email, password, phone, availability) VALUES
('Dr. John Smith', 'Cardiology', 'john@clinic.com', 'password123', '9876543210', 'Mon-Fri: 9AM-5PM'),
('Dr. Sarah Johnson', 'Neurology', 'sarah@clinic.com', 'password123', '9876543211', 'Mon-Sat: 10AM-6PM'),
('Dr. Michael Brown', 'Orthopedics', 'michael@clinic.com', 'password123', '9876543212', 'Tue-Sat: 9AM-5PM');
