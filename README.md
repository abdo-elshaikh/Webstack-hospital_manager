# Webstack-hospital_manager

## Project Overview
# API Endpoints
Webstack-hospital_manager is a comprehensive full-stack web application designed for hospital management. It leverages the MERN stack (MongoDB, Express, React, Node.js) for the backend and frontend, providing features such as user authentication, role-based access control, patient management, appointment scheduling, department and staff management, and responsive design.
## Auth
## Table of Contents
- `POST /api/auth/login` - Login a user
- [Project Overview](#project-overview)- `POST /api/auth/register` - Register a new user
- [Features](#features)
- [Installation](#installation)## Users
- [Usage](#usage)
- [Project Structure](#project-structure)- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get a user by ID
- `POST /api/users` - Create a new user (Admin only)
- `PUT /api/users/:id` - Update a user by ID (Admin only)
- `DELETE /api/users/:id` - Delete a user by ID (Admin only)

## Appointments

- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get an appointment by ID
- `POST /api/appointments` - Create a new appointment
- `PUT /api/appointments/:id` - Update an appointment by ID
- `DELETE /api/appointments/:id` - Delete an appointment by ID

## Departments

- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get a department by ID
- `POST /api/departments` - Create a new department
- `PUT /api/departments/:id` - Update a department by ID
- `DELETE /api/departments/:id` - Delete a department by ID

## Patients

- `GET /api/patients` - Get all patients
    git clone https://github.com/abdo-elshaikh/Webstack-hospital_manager.git- `GET /api/patients/:id` - Get a patient by ID
- `POST /api/patients` - Create a new patient
- `PUT /api/patients/:id` - Update a patient by ID
- `DELETE /api/patients/:id` - Delete a patient by ID

## Staff

- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get a staff member by ID
- `POST /api/staff` - Create a new staff member
- `PUT /api/staff/:id` - Update a staff member by ID
- `DELETE /api/staff/:id` - Delete a staff member by ID

## Services

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get a service by ID
- `POST /api/services` - Create a new service
- `PUT /api/services/:id` - Update a service by ID
- `DELETE /api/services/:id` - Delete a service by ID

## Book Appointments

     npm install- `GET /api/book-appointments` - Get all booked appointments
- `GET /api/book-appointments/:id` - Get a booked appointment by ID
- `POST /api/book-appointments` - Create a new booked appointment
- `PUT /api/book-appointments/:id` - Update a booked appointment by ID
- `DELETE /api/book-appointments/:id` - Delete a booked appointment by ID

## Invoices

- `GET /api/invoices` - Get all invoices
- `GET /api/invoices/:id` - Get an invoice by ID
- `POST /api/invoices` - Create a new invoice
- `PUT /api/invoices/:id` - Update an invoice by ID
- `DELETE /api/invoices/:id` - Delete an invoice by ID

## Pricing

- `GET /api/prices` - Get all prices
- `GET /api/prices/:id` - Get a price by ID
- `POST /api/prices` - Create a new price
- `PUT /api/prices/:id` - Update a price by ID
- `DELETE /api/prices/:id` - Delete a price by ID

