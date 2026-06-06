#### Build stage: Use Maven image with JDK 17 to compile the app
FROM maven:3.9.2-eclipse-temurin-17 AS builder

# Set working directory inside the container
WORKDIR /app

# Copy only the pom.xml to fetch dependencies separately
COPY pom.xml .

# Download all dependencies based on pom.xml to cache them
RUN mvn dependency:go-offline

# Copy the entire project source code into the container
COPY . .

# Run Maven to clean and package the application, skipping tests for speed
RUN mvn clean package -DskipTests

# Runtime stage: Use a smaller JDK image for running the app
FROM eclipse-temurin:17-jdk-jammy

# Set working directory inside the runtime container
WORKDIR /app

# Copy the built JAR file from the build stage to the runtime image
COPY --from=builder /app/target/doctor-appointment-api-1.0.0.jar app.jar

# List the JAR file to verify it exists (optional, mainly for debugging)
RUN ls -l /app/app.jar

# Expose port 8083 for the application
EXPOSE 8083

# Set the command to run the application when the container starts
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
