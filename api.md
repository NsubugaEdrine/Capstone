# UCU Innovators Hub

A web-based repository application for documenting, showcasing, and managing student projects and innovations at Uganda Christian University.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [API Documentation](#api-documentation)
- [Frontend API Usage](#frontend-api-usage)

---

## Tech Stack

| Layer    | Technology                    |
| -------- | ---------------------------- |
| Frontend | React, Vite, Axios           |
| Backend  | Node.js, Express             |
| Database | MySQL                        |
| Auth     | JWT (JSON Web Tokens)        |

---

## Setup

### Prerequisites

- Node.js 18+
- MySQL 8+
- npm or yarn

### Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your DB credentials
mysql -u root -p ucuhub < config/database.sql
npm run dev
```

### Frontend

```bash
cd frontend/frontend
npm install
# Create .env with: VITE_API_URL=http://localhost:5000/api
npm run dev
```

### Environment Variables

**Backend (.env)**

| Variable     | Description        | Example    |
| ----------- | ------------------ | ---------- |
| DB_HOST     | MySQL host         | localhost  |
| DB_USER     | MySQL user         | root       |
| DB_PASSWORD | MySQL password     | yourpass   |
| DB_NAME     | Database name      | ucuhub     |
| JWT_SECRET  | JWT signing secret | secret_key |
| PORT        | Server port        | 5000       |

---

## API Documentation

**Base URL:** `http://localhost:5000` (or your deployed URL)

**Authentication:** Protected routes require `Authorization: Bearer <token>` header.

---

### 1. Auth APIs

| Method | Endpoint            | Auth | Description        |
| ------ | ------------------- | ---- | ------------------ |
| POST   | `/api/auth/register`| No   | Register new user  |
| POST   | `/api/auth/login`   | No   | Login user         |

#### POST `/api/auth/register`

**Request Body (JSON):**

```json
{
  "name": "John Doe",
  "email": "john@ucu.ac.ug",
  "password": "SecurePass123!",
  "role": "student",
  "faculty": "Science & Technology"
}
```

| Field    | Type   | Required | Notes                                                                 |
| -------- | ------ | -------- | --------------------------------------------------------------------- |
| name     | string | Yes      | Full name                                                             |
| email    | string | Yes      | Must end with `@ucu.ac.ug`                                           |
| password | string | Yes      | Min 8 chars, letters + numbers + special chars                        |
| role     | string | Yes      | `student`, `supervisor`, or `admin`                                    |
| faculty  | string | No       | Faculty name                                                          |

**Response (201):**

```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "John Doe", "email": "john@ucu.ac.ug", "role": "student", "faculty": "..." }
}
```

---

#### POST `/api/auth/login`

**Request Body (JSON):**

```json
{
  "email": "john@ucu.ac.ug",
  "password": "SecurePass123!"
}
```

**Response (200):**

```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": 1, "name": "John Doe", "email": "john@ucu.ac.ug", "role": "student", "faculty": "..." }
}
```

---

### 2. Project APIs

| Method | Endpoint                         | Auth        | Role       | Description                    |
| ------ | -------------------------------- | ----------- | ---------- | ------------------------------ |
| POST   | `/api/projects/create`           | Yes (JWT)   | student    | Submit new project             |
| GET    | `/api/projects`                  | Yes (JWT)   | any        | Get all projects              |
| GET    | `/api/projects/approved`         | No          | -          | Get approved projects (public) |
| GET    | `/api/projects/approved/:id`     | No          | -          | Get single approved project    |
| PUT    | `/api/projects/approve/:id`     | Yes (JWT)   | supervisor| Approve project               |
| PUT    | `/api/projects/reject/:id`       | Yes (JWT)   | supervisor| Reject project                 |
| GET    | `/api/projects/:id/milestones`   | Yes (JWT)   | any        | Get project milestones         |
| POST   | `/api/projects/:id/milestones`   | Yes (JWT)   | student    | Add milestone                  |
| PUT    | `/api/projects/milestones/:id`   | Yes (JWT)   | student    | Update milestone status        |
| PUT    | `/api/projects/:id/progress`     | Yes (JWT)   | student    | Update project progress        |
| GET    | `/api/projects/:id/comments`     | No          | -          | Get project comments           |
| POST   | `/api/projects/:id/comments`     | Yes (JWT)   | any        | Add comment (project route)    |

---

#### POST `/api/projects/create`

**Headers:** `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`

**Request Body (FormData):**

| Field       | Type   | Required | Notes              |
| ----------- | ------ | -------- | ------------------- |
| title       | string | Yes      | Project title       |
| description | string | Yes      | Project description |
| category    | string | Yes      | e.g. Web Development|
| faculty     | string | No       | Faculty name        |
| technology  | string | Yes      | e.g. React, Python  |
| github_link | string | No       | GitHub repo URL     |
| document    | file   | Yes      | PDF file            |

**Response (200):**

```json
{
  "message": "Project submitted successfully",
  "projectId": 1,
  "file": "1234567890-filename.pdf"
}
```

---

#### GET `/api/projects/approved`

**Query Parameters (optional):**

| Param     | Type   | Description                    |
| --------- | ------ | ------------------------------ |
| search    | string | Search in title/description    |
| category  | string | Filter by category             |
| technology| string | Filter by technology           |
| faculty   | string | Filter by faculty              |
| year      | number | Filter by year (created_at)    |

**Example:** `GET /api/projects/approved?search=AI&category=Web%20Development&year=2025`

**Response (200):** Array of project objects

---

#### PUT `/api/projects/approve/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `{ "message": "Project approved successfully" }`

---

#### PUT `/api/projects/reject/:id`

**Headers:** `Authorization: Bearer <token>`

**Response (200):** `{ "message": "Project rejected" }`

---

#### GET `/api/projects/:id/milestones`

**Headers:** `Authorization: Bearer <token>`

**Response (200):** Array of milestone objects

---

#### POST `/api/projects/:id/milestones`

**Headers:** `Authorization: Bearer <token>`

**Request Body (JSON):**

```json
{
  "title": "Phase 1",
  "description": "Initial setup"
}
```

---

#### PUT `/api/projects/milestones/:milestoneId`

**Headers:** `Authorization: Bearer <token>`

**Request Body (JSON):**

```json
{
  "status": "completed"
}
```

`status` must be `pending` or `completed`.

---

#### PUT `/api/projects/:id/progress`

**Headers:** `Authorization: Bearer <token>`

**Request Body (JSON):**

```json
{
  "progress": 75
}
```

`progress` is 0–100.

---

### 3. Comment APIs (Standalone)

| Method | Endpoint           | Auth | Description      |
| ------ | ------------------ | ---- | ----------------- |
| POST   | `/api/comments/add`| Yes  | Add comment       |
| GET    | `/api/comments/:id`| No   | Get project comments |

---

#### POST `/api/comments/add`

**Headers:** `Authorization: Bearer <token>`

**Request Body (JSON):**

```json
{
  "project_id": 1,
  "comment": "Great project! Well done."
}
```

**Response (200):** `{ "message": "Comment added", "commentId": 1 }`

---

#### GET `/api/comments/:id`

**Path:** `:id` = project ID

**Response (200):** Array of comment objects with `id`, `comment`, `user_name`, `created_at`

---

### 4. Admin APIs

| Method | Endpoint                        | Auth | Role  | Description              |
| ------ | ------------------------------- | ---- | ----- | ------------------------ |
| GET    | `/api/admin/projects-per-faculty` | Yes  | admin | Projects count per faculty |
| GET    | `/api/admin/status-stats`       | Yes  | admin | Pending/approved/rejected counts |
| GET    | `/api/admin/trending-tech`      | Yes  | admin | Top technologies by usage |
| GET    | `/api/admin/top-students`       | Yes  | admin | Most active innovators   |

---

#### GET `/api/admin/projects-per-faculty`

**Headers:** `Authorization: Bearer <token>`

**Response (200):**

```json
[
  { "faculty": "Science & Technology", "total_projects": 5 },
  { "faculty": "Business", "total_projects": 3 }
]
```

---

#### GET `/api/admin/status-stats`

**Response (200):**

```json
[
  { "status": "pending", "total": 2 },
  { "status": "approved", "total": 10 },
  { "status": "rejected", "total": 1 }
]
```

---

#### GET `/api/admin/trending-tech`

**Response (200):**

```json
[
  { "technology": "React", "usage_count": 5 },
  { "technology": "Python", "usage_count": 3 }
]
```

---

#### GET `/api/admin/top-students`

**Response (200):**

```json
[
  { "name": "John Doe", "total_projects": 3 }
]
```

---

### 5. Utility APIs

| Method | Endpoint            | Auth | Description        |
| ------ | ------------------- | ---- | ------------------ |
| GET    | `/api/diagnose`     | No   | Backend health check |
| GET    | `/`                 | No   | Server status      |

---

### 6. Static Files

| Path              | Description          |
| ----------------- | -------------------- |
| `/uploads/:filename` | Uploaded PDF documents |

---

## Frontend API Usage

The frontend uses Axios with base URL `VITE_API_URL` (default: `http://localhost:5000/api`).

### AuthContext (`src/context/AuthContext.jsx`)

| Method   | API Call                    | When            |
| -------- | --------------------------- | --------------- |
| `login`  | `POST /auth/login`          | User signs in   |
| `register` | `POST /auth/register`     | User registers  |

### Login Page (`src/pages/Login.jsx`)

| Action | API Call |
| ------ | -------- |
| Submit form | `POST /auth/login` |

### Register Page (`src/pages/Register.jsx`)

| Action | API Call |
| ------ | -------- |
| Submit form | `POST /auth/register` |

### SubmitProject Page (`src/pages/SubmitProject.jsx`)

| Action | API Call |
| ------ | -------- |
| Submit project | `POST /projects/create` (FormData) |

### Projects Page (`src/pages/Projects.jsx`)

| Action | API Call |
| ------ | -------- |
| Load gallery | `GET /projects/approved?search=&category=&technology=&faculty=&year=` |
| Open project detail | `GET /projects/approved/:id` |
| Load comments | `GET /comments/:id` |
| Post comment | `POST /comments/add` |

### Supervisor Page (`src/pages/Supervisor.jsx`)

| Action | API Call |
| ------ | -------- |
| Load pending projects | `GET /projects` |
| Approve project | `PUT /projects/approve/:id` |
| Reject project | `PUT /projects/reject/:id` |

### AdminDashboard Page (`src/pages/AdminDashboard.jsx`)

| Action | API Call |
| ------ | -------- |
| Load analytics | `GET /admin/projects-per-faculty` |
| Load analytics | `GET /admin/trending-tech` |
| Load analytics | `GET /admin/status-stats` |
| Load top innovators | `GET /admin/top-students` |

---

## cURL Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@ucu.ac.ug","password":"Pass123!","role":"student","faculty":"Science"}'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@ucu.ac.ug","password":"Pass123!"}'
```

### Get Approved Projects

```bash
curl "http://localhost:5000/api/projects/approved?category=Web%20Development"
```

### Approve Project (with token)

```bash
curl -X PUT http://localhost:5000/api/projects/approve/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## License

© Uganda Christian University