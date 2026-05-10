# PrimeTrade — Internship Deliverables

A full-stack task management application with backend authentication, CRUD APIs, a React frontend, API documentation, and scalability guidance.

---

## Deliverables

1. **Backend project hosted in GitHub with README.md setup**
   - This repository contains the backend and frontend source code.
   - This `README.md` includes setup steps, API documentation, feature overview, and scalability notes.

2. **Working APIs for authentication & CRUD**
   - Auth endpoints:
     - `POST /api/v1/auth/register`
     - `POST /api/v1/auth/login`
     - `GET /api/v1/auth/me`
     - `GET /api/v1/auth/users`
   - Task CRUD endpoints:
     - `GET /api/v1/tasks`
     - `POST /api/v1/tasks`
     - `GET /api/v1/tasks/:id`
     - `PUT /api/v1/tasks/:id`
     - `DELETE /api/v1/tasks/:id`

3. **Basic frontend UI that connects to your APIs**
   - React frontend is located in `frontend/`.
   - It uses the backend API proxy configured in `frontend/package.json` to connect to `http://localhost:5000`.

4. **API documentation (Swagger/Postman collection)**
   - Swagger UI: `http://localhost:5000/api-docs`
   - Postman collection included: `PrimeTrade.postman_collection.json`

5. **Short scalability note**
   - See the Scalability Note section below for microservices, caching, and load balancing guidance.

---

## Tech Stack

- Backend: Node.js, Express.js
- Database: MongoDB + Mongoose
- Auth: JWT (`jsonwebtoken`), `bcryptjs`
- Validation: `express-validator`
- Security: `helmet`, `cors`, `express-rate-limit`
- Logging: `winston`
- Frontend: React.js
- Containerization: Docker, Docker Compose

---

## Project Structure

```
project/
├── backend/
│   ├── src/
│   │   ├── config/        # DB, Swagger, Logger
│   │   ├── controllers/   # authController, taskController
│   │   ├── middleware/    # auth, validate, errorHandler
│   │   ├── models/        # User, Task
│   │   ├── routes/        # authRoutes, taskRoutes
│   │   └── index.js       # Express app entry point
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── components/    # TaskModal
│   │   ├── utils/         # api.js, AuthContext.js
│   │   ├── styles/        # global.css
│   │   └── App.js
│   └── package.json
├── docker-compose.yml
├── PrimeTrade.postman_collection.json
└── README.md
```

---

## Setup Instructions

### Prerequisites
- Node.js 18+
- MongoDB running locally OR Docker

### Option 1 — Run with Docker

```bash
git clone <your-github-repo-url>
cd primetrade_internship_project/project
docker-compose up --build
```

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- API docs: `http://localhost:5000/api-docs`

### Option 2 — Run Locally

**Backend**

```bash
cd project/backend
npm install
copy .env.example .env
# edit .env if needed
npm start
```

**Frontend**

```bash
cd project/frontend
npm install
npm start
```

---

## API Reference

### Base URL
`http://localhost:5000/api/v1`

### Auth Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /auth/register | Public | Register new user |
| POST | /auth/login | Public | Login & get JWT |
| GET | /auth/me | Authenticated | Get current user |
| GET | /auth/users | Admin | Get all users |

### Task Endpoints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /tasks | User/Admin | Get tasks (admin sees all) |
| POST | /tasks | User/Admin | Create a task |
| GET | /tasks/:id | Owner/Admin | Get task by ID |
| PUT | /tasks/:id | Owner/Admin | Update task |
| DELETE | /tasks/:id | Owner/Admin | Delete task |

### Documentation
- Swagger UI: `http://localhost:5000/api-docs`
- Postman collection: `PrimeTrade.postman_collection.json`

---

## Frontend

The React frontend in `frontend/` connects to the backend using the proxy in `frontend/package.json`.

Features:
- login and register
- task dashboard
- create, edit, delete tasks

---

## Scalability Note

- **Microservices:** Split auth and task logic into separate services behind an API gateway.
- **Caching:** Add Redis caching for task queries to reduce database load.
- **Load balancing:** Place a load balancer in front of multiple backend replicas.
- **Centralized logging:** Use Winston with ELK/Datadog for production monitoring.
- **Database scaling:** Use MongoDB sharding or a managed hosted database for high availability.

---

## Notes

- The backend supports JWT auth and RBAC for user/admin access control.
- Use a real MongoDB URI in `.env` for production; in-memory MongoDB is only for local development.

---

## Author
Built for Primetrade.ai Backend Developer Intern Assignment
