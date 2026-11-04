# Employee Leave Management System

A full-stack web application for managing employees and their leave requests. It provides a dashboard to track leave statistics, allows employees to submit leave requests, and enables administrators to approve or reject them.

## Features

### Dashboard

- View total number of employees.
- View pending, approved, and rejected leave request counts.

### Employee Management

- Add new employees.
- View the list of employees.
- Store employee details such as name, email, and department.
- Validate required fields and prevent duplicate email addresses.

### Leave Management

- Submit leave requests for registered employees.
- Select leave type: Casual, Sick, or Earned.
- Specify leave start date, end date, and reason.
- View all leave requests.
- Filter leave requests by employee and status.
- Approve or reject pending leave requests.
- Prevent overlapping pending or approved leave requests for the same employee.
- Validate leave dates to ensure the end date is not earlier than the start date.

## Tech Stack

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- React Hook Form
- React Toastify
- Lucide React

### Backend

- Node.js
- Express.js
- TypeScript
- Drizzle ORM
- Drizzle Kit
- PostgreSQL
- dotenv
- CORS

## Project Structure

```text
Employee-Leave-Management/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── db/
│   │   │   └── schema/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── server.ts
│   │   └── app.ts
│   │
│   ├── drizzle/
│   ├── drizzle.config.ts
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   ├── public/
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- PostgreSQL database

### 1. Clone the Repository

```bash
git clone https://github.com/Daksh-Vasala/employee-leave-management
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=3000
DATABASE_URL=your_postgresql_connection_string
CLIENT_URL=http://localhost:5173
```

Replace `your_postgresql_connection_string` with your PostgreSQL connection string.

### 3. Database Setup

Generate the database migrations:

```bash
npm run db:generate
```

Run the migrations:

```bash
npm run db:migrate
```

### 4. Start the Backend Server

Run the development server:

```bash
npm run dev
```

The backend server will run at:

```text
http://localhost:3000
```

### 5. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api/v1
```

### 6. Start the Frontend

```bash
npm run dev
```

Open the local URL displayed in your terminal to access the application.

## API Endpoints

All API endpoints are prefixed with `/api/v1`.

| Method | Endpoint      | Description                 |
| ------ | ------------- | --------------------------- |
| GET    | `/employees`  | Get all employees           |
| POST   | `/employees`  | Create a new employee       |
| GET    | `/leaves`     | Get all leave requests      |
| POST   | `/leaves`     | Submit a leave request      |
| PATCH  | `/leaves/:id` | Update leave request status |
| GET    | `/dashboard`  | Get dashboard statistics    |

## Database Schema

The application uses PostgreSQL with two main tables.

### Employees

Stores employee information.

| Column     | Description               |
| ---------- | ------------------------- |
| id         | Primary key               |
| name       | Employee name             |
| email      | Employee email (unique)   |
| department | Employee department       |
| created_at | Record creation timestamp |
| updated_at | Record update timestamp   |

### Leave Requests

Stores employee leave requests.

| Column      | Description                       |
| ----------- | --------------------------------- |
| id          | Primary key                       |
| employee_id | Foreign key referencing employees |
| leave_type  | Casual, Sick, or Earned           |
| start_date  | Leave start date                  |
| end_date    | Leave end date                    |
| reason      | Reason for leave                  |
| status      | Pending, Approved, or Rejected    |
| created_at  | Record creation timestamp         |

## Validation and Business Rules

- Employee name, email, and department are required.
- Employee email addresses must be unique.
- A leave request must belong to an existing employee.
- Leave type, start date, end date, and reason are required.
- The end date cannot be earlier than the start date.
- Employees cannot have overlapping pending or approved leave requests.
- Only pending leave requests can be approved or rejected.

## Scope

This project focuses on employee and leave management functionality. Authentication and authorization are not included, as they were outside the scope of the assessment.
