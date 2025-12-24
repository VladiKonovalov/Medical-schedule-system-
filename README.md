# Medical Scheduling System

A medical appointment scheduling system with Spring Boot backend and React frontend.

## Features

- Phone-based OTP authentication
- Patient dashboard
- Appointment booking and management
- Search for doctors and specialties
- Appointment reminders

## Tech Stack

**Backend:** Java 17, Spring Boot, Spring Data JPA, H2 Database, Spring Security, JWT

**Frontend:** React, React Router, Axios

## Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 16+ and npm

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend runs on `http://localhost:3000`

## Usage

1. Start both backend and frontend servers
2. Enter a phone number and click "Send OTP"
3. Enter the OTP code shown in the UI to login
4. Book appointments by selecting medical field, doctor, date, and time

The app includes sample data: 6 medical fields, 8 doctors, and time slots from 9 AM to 5 PM.

## API Endpoints

**Authentication**
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP

**Medical Fields**
- `GET /api/medical-fields` - Get all specialties

**Doctors**
- `GET /api/doctors?fieldId={id}` - Get doctors by field

**Appointments**
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/upcoming` - Get upcoming
- `GET /api/appointments/past` - Get past
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}/cancel` - Cancel
- `PUT /api/appointments/{id}/reschedule` - Reschedule

**Time Slots**
- `GET /api/time-slots?doctorId={id}&date={date}` - Get available slots

**Search**
- `GET /api/search?q={query}` - Search doctors and specialties

## Deployment

For production, update `application.properties` to use PostgreSQL or MySQL instead of H2. Set `REACT_APP_API_URL` environment variable for the frontend to point to your deployed backend.
