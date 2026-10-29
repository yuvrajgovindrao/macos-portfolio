# TeamFlow: Team Task Manager

A collaborative, multi-tenant task and project management web application built with **React**, **Node.js**, **Express**, and **PostgreSQL**, featuring granular role-based access control (RBAC), OTP-verified user onboarding, and relational schema migrations.

[![Repository](https://img.shields.io/badge/GitHub-team--task--manager-181717?logo=github&logoColor=white)](https://github.com/yuvrajgovindrao/team-task-manager)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-black?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)

---

## Architecture & System Overview

TeamFlow decouples client-side project visualization from a modular Express REST backend backed by a relational PostgreSQL database.

```mermaid
flowchart TD
    subgraph Client[" Frontend Client"]
        UI["React SPA\n(Project & Task Dashboards)"]
        AUTH_VIEW["Auth Views\n(OTP, Login, Password Reset)"]
        UI <--> AUTH_VIEW
    end

    subgraph Server[" Express.js Backend"]
        ROUTER["API Router\n(/auth, /projects, /tasks, /members)"]
        AUTH_MW["JWT & RBAC Middleware\n(Admin vs Member Authorization)"]
        SERVICES["Business Logic Layer\n(Task Assignment & Project State)"]
        ROUTER --> AUTH_MW
        AUTH_MW --> SERVICES
    end

    subgraph Storage[" Database & Security"]
        PG[("PostgreSQL 16\n(Junction Tables & Versioned Migrations)")]
        BCRYPT["bcrypt\n(Salted Password Hashing)"]
        JWT["JWT Sessions\n(Token Signing & Verification)"]
    end

    UI <==>|REST API / JSON| ROUTER
    SERVICES <--> PG
    AUTH_MW <--> JWT
    SERVICES <--> BCRYPT
```

---

## Key Highlights & Features

### 1. Robust Authentication & Session Lifecycle
- **Password Security**: Passwords salted and hashed with `bcrypt`.
- **OTP Verification**: Secure one-time password flow for user signup and email validation.
- **Stateless JWT Sessions**: JSON Web Tokens for stateless, scalable session verification.
- **Custom Password Reset**: End-to-end self-service credential recovery built from scratch without external SaaS lock-in.

### 2. Express Middleware Role-Based Access Control (RBAC)
- Enforces strict **Admin vs. Member** permissions per project directly within Express middleware.
- Verifies project membership and access privileges before executing write, update, or destructive actions.

### 3. PostgreSQL Relational Data Modeling & Migrations
- **Multi-Assignee Task Relationships**: Tasks assigned to multiple project members modeled efficiently using a normalized `task_assignments` junction table.
- **Versioned Schema Migrations**: Four structured SQL migrations ensuring clean, predictable database evolutionary changes across development and production environments.

---

## Technical Specifications

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Frontend** | React, HTML5, CSS3, Vite | Responsive project and task management dashboard |
| **Backend** | Node.js, Express.js | Modular RESTful API design with separation of concerns |
| **Database** | PostgreSQL 16 | Relational schema with junction tables and foreign key constraints |
| **Authentication** | bcrypt, JSON Web Tokens (JWT), OTP | Secure password hashing, tokenized auth, and recovery |
| **Source Code** | [github.com/yuvrajgovindrao/team-task-manager](https://github.com/yuvrajgovindrao/team-task-manager) | Open-source repository |
