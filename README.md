# EduTask

## Student Productivity and Task Management System

EduTask is a web-based academic productivity application developed to help students organize subjects, manage tasks, monitor deadlines, record focus sessions, and track overall academic progress.

The system provides a centralized platform where students can manage their academic responsibilities efficiently without relying on multiple productivity tools.

---

## Project Overview

Students often experience difficulties managing multiple requirements, deadlines, projects, and academic responsibilities at the same time.

Common challenges include:

* Missing deadlines
* Forgetting academic requirements
* Poor task organization
* Difficulty monitoring progress
* Lack of study habit tracking

EduTask was developed to address these challenges by providing an organized environment where students can manage their academic workload from a single system.

---

## Key Features

### User Management

The system allows students to:

* Register accounts
* Login to the system
* Store profile information
* Manage academic program details

---

### Subject Management

Students can organize their academic work through subjects.

Examples:

```text
Object-Oriented Programming
Database Systems
Software Engineering
Web Development
```

Features:

* Create Subject
* Edit Subject
* Delete Subject
* Assign Subject Labels

---

### Task Management

The Task Module serves as the core feature of EduTask.

Features:

* Create Tasks
* Edit Tasks
* Delete Tasks
* Mark Tasks as Completed
* Assign Priorities
* Set Due Dates
* Associate Tasks with Subjects

Priority Levels:

```text
URGENT
MODERATE
CHILL
```

Task Status:

```text
PENDING
COMPLETED
```

---

### Deadline Monitoring

EduTask automatically categorizes academic requirements according to urgency.

Categories:

* Due Today
* Due This Week
* Upcoming Deadlines

This helps students focus on tasks that require immediate attention.

---

### Dashboard Summary

The Dashboard Module provides a quick productivity overview.

Displayed Information:

```text
Total Tasks
Pending Tasks
Completed Tasks
Completion Percentage
```

This allows students to monitor their workload and productivity at a glance.

---

### Focus Session Tracking

EduTask includes a Pomodoro-inspired study tracking feature.

Students can record:

```text
Focus Duration
Break Duration
Completion Time
```

The purpose of this module is to help students develop productive study habits.

---

### Progress Tracking

The Progress Module calculates statistics per subject.

Example:

```text
Programming
8 Completed Tasks
10 Total Tasks
80% Completion Percentage
```

This enables students to identify subjects that may require additional attention.

---

# Technology Stack

## Backend

* Java 21
* Spring Boot
* Spring Data JPA
* Hibernate
* Lombok

## Frontend

* React
* React Router
* Axios
* Vite

## Database

* H2 Database

The project currently uses H2 Database because it integrates directly with Spring Boot and simplifies development and testing.

---

# System Architecture

EduTask follows a layered architecture.

```text
Frontend
    ↓
Controller Layer
    ↓
Service Layer
    ↓
Repository Layer
    ↓
H2 Database
```

Each layer has a dedicated responsibility, making the application easier to maintain and extend.

---

# Backend Modules

```text
User Module
Subject Module
Task Module
Deadline Module
Dashboard Module
Focus Session Module
Progress Tracking Module
```

Each module follows the same architecture:

```text
Controller
Service
Repository
Entity
```

---

# REST API Endpoints

## User Endpoints

```http
POST /api/users/register
POST /api/users/login
GET  /api/users
```

---

## Subject Endpoints

```http
GET    /api/subjects
POST   /api/subjects
PUT    /api/subjects/{id}
DELETE /api/subjects/{id}
```

---

## Task Endpoints

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
PATCH  /api/tasks/{id}/complete
```

---

## Deadline Endpoints

```http
GET /api/tasks/due-today
GET /api/tasks/due-this-week
GET /api/tasks/upcoming
```

---

## Dashboard Endpoint

```http
GET /api/dashboard/summary
```

---

## Focus Session Endpoints

```http
GET    /api/focus
POST   /api/focus/complete
DELETE /api/focus/{id}
```

---

## Progress Tracking Endpoint

```http
GET /api/progress/subjects
```

---

# Object-Oriented Programming Concepts

## Encapsulation

Applied in:

```text
User
Subject
Task
FocusSession
```

Private fields are protected through getters and setters generated using Lombok.

This protects data integrity and prevents unauthorized modifications.

---

## Abstraction

Applied through service classes:

```text
UserService
SubjectService
TaskService
DashboardService
FocusSessionService
ProgressService
```

Business logic is hidden from controllers, allowing controllers to focus only on handling requests and responses.

---

## Composition

Implemented through entity relationships.

Examples:

```text
Task → User
Task → Subject
FocusSession → User
```

These relationships model real-world academic activities.

---

# Design Patterns Used

## Repository Pattern

Implemented through:

```text
UserRepository
SubjectRepository
TaskRepository
FocusSessionRepository
```

Purpose:

Separates database operations from business logic.

---

## Service Layer Pattern

Implemented through:

```text
UserService
SubjectService
TaskService
DashboardService
FocusSessionService
ProgressService
```

Purpose:

Centralizes business logic and improves maintainability.

---

## MVC Pattern

Implemented throughout the application.

```text
Controller
    ↓
Service
    ↓
Repository
    ↓
Database
```

Purpose:

Separates concerns and improves code organization.

---

## DTO Pattern

Implemented through:

```text
DashboardSummary
ProgressSummary
```

Purpose:

Transfers only the data required by the frontend without exposing complete entities.

---

# Software Engineering Best Practices

### Separation of Concerns

Responsibilities are divided among:

* Controllers
* Services
* Repositories
* Entities
* DTOs

---

### Single Responsibility Principle

Each class is responsible for one primary task.

Examples:

* Controllers handle requests
* Services handle business logic
* Repositories access data
* Entities represent data
* DTOs transfer data

---

# Current MVP Scope

Implemented Features:

```text
User Management
Subject Management
Task CRUD Operations
Task Prioritization
Task Completion Tracking
Deadline Monitoring
Dashboard Summary
Focus Session Recording
Progress Tracking
```

---

# Future Enhancements

Planned improvements include:

* JWT Authentication
* BCrypt Password Encryption
* Profile Management
* Calendar Integration
* Notifications
* Advanced Analytics
* Mobile Responsive Design
* Cloud Deployment

---

# Development Team

Jherrymei D. Arandela
Lynette Grace L. Galindon
