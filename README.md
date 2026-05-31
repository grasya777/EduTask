# EduTask

### Academic Productivity Platform for Students

EduTask is a web-based productivity application developed to help students manage academic responsibilities through task organization, subject tracking, deadline monitoring, focus sessions, and progress visualization.

The platform centralizes common academic workflows into a single system, allowing students to stay organized and maintain awareness of their academic performance.

---

## Why EduTask?

Students often struggle with:

* Managing multiple subjects simultaneously
* Keeping track of deadlines
* Monitoring task completion
* Maintaining study focus
* Measuring academic progress

EduTask addresses these challenges by providing a structured environment where tasks, deadlines, subjects, and focus sessions are managed together.

---

## What Users Can Do

### Organize Subjects

Create academic subjects and categorize tasks under each one.

Examples:

```text
Object-Oriented Programming
Database Systems
Software Engineering
Web Development
```

---

### Manage Tasks

Students can:

* Create tasks
* Edit existing tasks
* Delete tasks
* Assign priorities
* Set due dates
* Mark tasks as completed

Supported priorities:

```text
URGENT
MODERATE
CHILL
```

---

### Monitor Deadlines

EduTask automatically categorizes deadlines into:

* Due Today
* Due This Week
* Upcoming Tasks

This allows students to focus on the most urgent academic requirements first.

---

### Track Productivity

The dashboard provides a quick summary of:

```text
Total Tasks
Pending Tasks
Completed Tasks
Completion Percentage
```

This gives students immediate feedback regarding their workload and productivity.

---

### Record Focus Sessions

EduTask includes a Pomodoro-inspired study tracking system.

Students can record:

```text
Focus Duration
Break Duration
Completion Time
```

These sessions can later be used to analyze study habits.

---

### Measure Progress

Progress statistics are calculated per subject.

Example:

```text
Programming
8 Completed Tasks
10 Total Tasks
80% Completion Rate
```

This helps students identify which subjects require additional attention.

---

## System Architecture

The application follows a layered backend architecture.

```text
Controller Layer
      ↓
Service Layer
      ↓
Repository Layer
      ↓
Database Layer
```

This structure improves maintainability, readability, and scalability.

---

## Technology Stack

### Backend

```text
Java 21
Spring Boot
Spring Data JPA
Hibernate
Lombok
```

### Frontend

```text
React
React Router
Axios
Vite
```

### Database

```text
PostgreSQL
```

---

## Backend Modules

```text
User Management
Subject Management
Task Management
Deadline Monitoring
Dashboard Analytics
Focus Session Tracking
Progress Tracking
```

Each module follows the same architecture:

```text
Controller
Service
Repository
Entity
```

---

## REST API Modules

### Users

```http
POST /api/users/register
POST /api/users/login
GET  /api/users
```

### Subjects

```http
GET    /api/subjects
POST   /api/subjects
PUT    /api/subjects/{id}
DELETE /api/subjects/{id}
```

### Tasks

```http
GET    /api/tasks
POST   /api/tasks
PUT    /api/tasks/{id}
DELETE /api/tasks/{id}
PATCH  /api/tasks/{id}/complete
```

### Deadlines

```http
GET /api/tasks/due-today
GET /api/tasks/due-this-week
GET /api/tasks/upcoming
```

### Dashboard

```http
GET /api/dashboard/summary
```

### Focus Sessions

```http
GET    /api/focus
POST   /api/focus/complete
DELETE /api/focus/{id}
```

### Progress Tracking

```http
GET /api/progress/subjects
```

---

## Software Engineering Practices

The project applies several Object-Oriented Programming principles:

### Encapsulation

Applied through entity classes such as:

```text
User
Task
Subject
FocusSession
```

---

### Abstraction

Business logic is hidden inside service classes:

```text
UserService
TaskService
SubjectService
DashboardService
ProgressService
FocusSessionService
```

---

### Composition

Relationships between entities:

```text
Task → User
Task → Subject
FocusSession → User
```

---

## Design Patterns

### Repository Pattern

Used for database operations.

```text
UserRepository
TaskRepository
SubjectRepository
FocusSessionRepository
```

### Service Layer Pattern

Used to separate business rules from request handling.

### MVC Pattern

Implemented through:

```text
Controller
Service
Repository
Entity
```

### DTO Pattern

Used for dashboard and progress summaries.

```text
DashboardSummary
ProgressSummary
```

---

## Current MVP Scope

Completed:

```text
User Management
Subject Management
Task CRUD Operations
Task Completion Tracking
Priority Management
Deadline APIs
Dashboard Analytics
Focus Session Recording
Progress Tracking
```

Planned Enhancements:

```text
JWT Authentication
Profile Management
Email Notifications
Calendar Integration
Advanced Analytics
Cloud Deployment
```

---

## Developed By

Arandela, Jherrymei D.
Galindon, Lynette Grace L.
