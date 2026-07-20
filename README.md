# Hospitality Doctor Appointment System

A full-stack hospital appointment scheduling project with a Spring Boot backend, React frontend, and MySQL database.

## Pre-requisites

- Java 17+ installed and available in `PATH`
- Maven installed and available in `PATH`
- Node.js and npm installed
- MySQL server installed and running
- Git (optional, for cloning the repository)

## Setup

1. Clone the repository

   ```bash
   git clone https://github.com/devopsplan2026/Hospitality-.git
   cd hospitality
   ```

2. Install backend dependencies

   ```bash
   cd backend
   mvn clean install
   ```

3. Install frontend dependencies

   ```bash
   cd ../frontend
   npm install
   ```

4. Configure MySQL

   - Create the database:

     ```sql
     CREATE DATABASE doctor_appointment;
     ```

   - Optionally, run the SQL schema and sample data script:

     ```bash
     mysql -u root -p doctor_appointment < ../database/init.sql
     ```

   - Ensure the database connection settings in `backend/src/main/resources/application.yml` are correct:

     ```yaml
     spring:
       datasource:
         url: jdbc:mysql://localhost:3306/doctor_appointment
         username: doctor_app
         password: DoctorApp123!
     ```

   - If you need to override credentials or URL at runtime, you can set environment variables:

     ```bash
     export SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/doctor_appointment
     export SPRING_DATASOURCE_USERNAME=doctor_app
     export SPRING_DATASOURCE_PASSWORD=DoctorApp123!
     ```

## Running the application

### Backend

From the `backend` directory:

```bash
mvn spring-boot:run
```

The backend runs on `http://localhost:8083/api` by default.

### Frontend

From the `frontend` directory:

```bash
npm start
```

The frontend runs on `http://localhost:3003` by default.

## Important Notes

- The backend uses Spring Boot context path `/api`, so all API routes are prefixed with `/api`.
- The frontend is configured to communicate with `http://localhost:8083/api`.
- Make sure the backend is running before using the frontend UI.

## Directory structure

- `backend/` - Spring Boot API server
- `frontend/` - React client application
- `database/` - SQL schema and sample data script

## Common commands

- Build backend:

  ```bash
  cd backend
  mvn clean package
  ```

- Build frontend:

  ```bash
  cd frontend
  npm run build
  ```

- Run backend jar:

  ```bash
  cd backend
  java -jar target/doctor-appointment-api-1.0.0.jar
  ```

## Troubleshooting

- If MySQL login fails, verify username/password and that `doctor_appointment` exists.
- If port `8083` is busy, stop the process or change `server.port` in `backend/src/main/resources/application.yml`.
- If the frontend cannot connect, confirm the backend is running and API base URL matches.
