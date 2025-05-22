
# ✅ PMS MVP Development TASK List (TASK.md)

Initial scope: login, project registration/view/edit, basic Gantt chart, admin project listing.

---

## 🔐 User Authentication

> JWT-based login and role-based access

- [ ] Create `users` table in Supabase
- [ ] Spring Boot - Implement login API (issue JWT)
- [ ] Spring Boot - JWT filter and role verification
- [ ] React - Implement login UI (email/password form)
- [ ] React - Store JWT and route to dashboard on success
- [ ] React - Logout function (clear JWT and redirect)

---

## 📁 User Features - Project Management

- [ ] Create `projects` table in Supabase
- [ ] Create `project_users` table for user-project mapping
- [ ] Spring Boot - Project registration API
- [ ] Spring Boot - Retrieve user’s project list API
- [ ] Spring Boot - Project detail view API
- [ ] Spring Boot - Project update API (only by creator)
- [ ] React - Project creation form UI
- [ ] React - Project list screen
- [ ] React - Project detail/edit screen
- [ ] Spring Boot - Add/remove user to/from project via `project_users`
- [ ] React - Assign users to project with roles

---

## 📊 User Features - Gantt Chart

- [ ] Create `tasks` table in Supabase
- [ ] Spring Boot - Task creation API
- [ ] Spring Boot - Retrieve task list by project API
- [ ] Spring Boot - Task update API (support Drag & Drop)
- [ ] React - Integrate Gantt chart library (`frappe-gantt`, `react-gantt`)
- [ ] React - Connect Gantt data with task list
- [ ] React - Task create/edit UI

---

## 🧑‍💼 Admin Features - Project Oversight

- [ ] Spring Boot - Get all projects API (with filters)
- [ ] Spring Boot - Project delete API
- [ ] Spring Boot - Verify role is ADMIN
- [ ] React - Admin project list screen
- [ ] React - Admin delete button for projects
- [ ] React - Role-based button visibility

---

## 👥 Admin Features - User Role Management

- [ ] Spring Boot - Get user list API
- [ ] Spring Boot - Update user role API
- [ ] React - User list UI
- [ ] React - Role update form

---

## 🛠 System & Environment Setup

- [ ] Create GitHub repo and initialize
- [ ] Create Supabase project and tables
- [ ] Setup Spring Boot project and connect to DB
- [ ] Setup React project (Vite or CRA)
- [ ] Configure environment variables (.env)
- [ ] Setup CORS on backend
- [ ] Apply responsive web layout

---

## 📦 Deployment & Testing

- [ ] Test Supabase connection
- [ ] Test APIs via Postman
- [ ] Verify frontend-backend integration
- [ ] Deploy to Vercel/Netlify or internal server
- [ ] Test using USER and ADMIN accounts

---

## 🛡 Secure Coding Checklist

- [ ] Input validation (Spring Validation, XSS protection)
- [ ] Prevent SQL Injection (bind variables)
- [ ] Store JWT secret in environment variables or vault
- [ ] Backend-based authorization only (no frontend trust)
- [ ] Passwords stored as hashes (e.g., bcrypt)
- [ ] Mask sensitive info in API responses
- [ ] Use Supabase RLS (Row Level Security)
- [ ] Enforce HTTPS in production
- [ ] Enable audit logs for login/project updates

---

## 🗂 Supabase Table Definitions

---

### 1. `users` Table

| Column      | Type      | Description                 |
|-------------|-----------|-----------------------------|
| id          | UUID      | Primary key                 |
| email       | TEXT      | Unique email                |
| password    | TEXT      | Hashed password             |
| role        | TEXT      | Role (USER / ADMIN)         |
| created_at  | TIMESTAMP | Timestamp                   |

---

### 2. `projects` Table

| Column      | Type      | Description                       |
|-------------|-----------|------------------------------------|
| id          | UUID      | Primary key                       |
| name        | TEXT      | Project name                      |
| code        | TEXT      | Unique code                       |
| client      | TEXT      | Client company                    |
| start_date  | DATE      | Start date                        |
| end_date    | DATE      | End date                          |
| status      | TEXT      | Status (e.g., planning, dev)      |
| created_by  | UUID      | Created by (users.id FK)          |
| created_at  | TIMESTAMP | Timestamp                         |

---

### 3. `project_users` Table (Many-to-Many mapping)

| Column      | Type      | Description                       |
|-------------|-----------|------------------------------------|
| id          | UUID      | Primary key                       |
| project_id  | UUID      | Foreign key to `projects.id`      |
| user_id     | UUID      | Foreign key to `users.id`         |
| role        | TEXT      | Role in the project               |
| joined_at   | TIMESTAMP | Timestamp of joining              |

---

### 💡 Recommended Role Values (ENUM or constants)

- `PMO`
- `PM`
- `DESIGNER`
- `DEVELOPER`
- `QA`
- `CONSULTANT`

---

### 4. `tasks` Table

| Column      | Type      | Description                       |
|-------------|-----------|------------------------------------|
| id          | UUID      | Primary key                       |
| project_id  | UUID      | Foreign key to `projects.id`      |
| title       | TEXT      | Task title                        |
| start_date  | DATE      | Start date                        |
| end_date    | DATE      | End date                          |
| created_at  | TIMESTAMP | Timestamp                         |

---

## 📌 Table Creation Order

1. `users`
2. `projects`
3. `project_users`
4. `tasks`
