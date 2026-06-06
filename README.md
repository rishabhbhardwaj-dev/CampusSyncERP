# 🎓 CampusSync ERP

> **An Enterprise-Grade University Management System**
>
> CampusSync is a comprehensive, scalable, and modern Educational Resource Planning (ERP) platform designed to streamline campus operations. It bridges the gap between administrators, faculty, and students through a unified, role-based SaaS interface.

---

## 🚀 Project Overview

CampusSync provides a digital ecosystem to manage the entire academic lifecycle. From student admissions and faculty rosters to live attendance tracking, fee management, and dynamic exam grading, CampusSync replaces fragmented legacy systems with a single, blazing-fast web application. 

Built with scalability in mind, it features a highly optimized Node.js backend using the **Controller-Service-Repository** pattern and a beautiful, high-fidelity React frontend wrapped in Tailwind CSS.

---

## ✨ Core Features

*   🔐 **Role-Based Access Control (RBAC):** Distinct, secure portals for Admins, Faculty, and Students.
*   📊 **Real-time Analytics Dashboard:** Dynamic Recharts integration showing attendance trends, fee collection status, and demographic distributions.
*   👨‍🎓 **Student & Faculty Management:** Enterprise data tables with advanced search, pagination, and inline status badges.
*   📅 **Academic Timetables:** Class scheduling and automated routing for faculty.
*   ✅ **Attendance Tracking:** Seamless daily attendance marking with automated percentage calculations and shortage alerts.
*   📝 **Examination & Marks:** Complete workflow from internal exam grading to final scorecard generation.
*   💳 **Fee Management:** Track total collections, pending dues, assign bulk fees, and generate payment receipts.
*   📁 **Document Vault:** Secure upload and access for assignments, study materials, and administrative documents.
*   📢 **Campus Notices:** Real-time push announcements across the entire organization.

---

## 🏗️ Architecture & Tech Stack

CampusSync is built on a modern **PERN** (PostgreSQL, Express, React, Node) stack, utilizing Prisma as a next-generation ORM.

### Frontend
*   **Framework:** React 18 (Vite)
*   **Styling:** Tailwind CSS (Enterprise SaaS aesthetic, Glassmorphism, Dark Mode)
*   **Routing:** React Router v6
*   **Data Visualization:** Recharts
*   **State & HTTP:** Axios, React Hooks
*   **Icons & Toasts:** React-Icons (Heroicons), React Hot Toast

### Backend
*   **Runtime:** Node.js
*   **Framework:** Express.js
*   **Database ORM:** Prisma
*   **Security:** JWT (JSON Web Tokens), bcryptjs, Helmet, CORS
*   **Validation:** Express-Validator
*   **File Handling:** Multer (Local/Cloud storage)

---

## 📸 Screenshots

*(Replace the placeholder URLs with actual deployed image paths)*

| Dashboard Overview | Student Roster |
| :---: | :---: |
| ![Dashboard](https://via.placeholder.com/600x350/1e293b/ffffff?text=Admin+Dashboard+Analytics) | ![Students](https://via.placeholder.com/600x350/1e293b/ffffff?text=Enterprise+Data+Tables) |

| Fee Management | Attendance Tracking |
| :---: | :---: |
| ![Fees](https://via.placeholder.com/600x350/1e293b/ffffff?text=Fee+Collection+Module) | ![Attendance](https://via.placeholder.com/600x350/1e293b/ffffff?text=Live+Attendance+Tracking) |

---

## ⚙️ Installation & Local Setup

### Prerequisites
*   Node.js (v18+ recommended)
*   PostgreSQL or MySQL Database
*   Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CampusSync.git
cd CampusSync
```

### 2. Backend Setup
```bash
cd server
npm install

# Create a .env file and add your database credentials
echo "DATABASE_URL=postgresql://user:password@localhost:5432/campussync" > .env
echo "JWT_SECRET=your_super_secret_key" >> .env
echo "PORT=5000" >> .env

# Run database migrations
npx prisma migrate dev --name init

# Seed the database with initial Admin/Roles (if configured)
npx prisma db seed

# Start the development server
npm run dev
```

### 3. Frontend Setup
```bash
# Open a new terminal
cd client
npm install

# Start the Vite development server
npm run dev
```
The application will now be running at `http://localhost:5173`.

---

## 🛣️ API Structure

The backend follows a strictly decoupled `Routes -> Validator -> Controller -> Service` architecture. 

All API responses follow a standardized JSON envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Core Endpoints
*   `POST /api/auth/login` - Authenticate users & return JWT
*   `GET /api/students` - Paginated list of students with search filters
*   `GET /api/dashboard/stats` - Fetch aggregate KPI metrics
*   `POST /api/marks` - Upload student examination results
*   `POST /api/fees/pay` - Process fee transactions

---

## 📂 Folder Structure

```text
CampusSync/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/         # Reusable UI elements (Buttons, Modals, Loaders)
│   │   ├── context/            # Global React Context (AuthContext)
│   │   ├── layouts/            # Dashboard & Auth Shells
│   │   ├── pages/              # Main Views (Dashboard, Students, Fees, etc.)
│   │   ├── services/           # Axios API wrappers
│   │   └── index.css           # Tailwind configuration
├── server/                     # Node.js Backend
│   ├── prisma/                 # Database Schema & Migrations
│   ├── src/
│   │   ├── config/             # DB & Environment configs
│   │   ├── middleware/         # Auth, RBAC, Error Handling, Validators
│   │   ├── modules/            # Feature-based domains (Students, Faculty, Auth)
│   │   │   └── students/
│   │   │       ├── student.routes.js
│   │   │       ├── student.controller.js
│   │   │       ├── student.service.js
│   │   │       └── student.validator.js
│   │   ├── utils/              # Helper classes (ApiResponse, ApiError)
│   │   ├── app.js              # Express app initialization
│   │   └── server.js           # Entry point
└── README.md                   
```

---

## 🌐 Deployment

*   **Live Application:** [https://campussync.yourdomain.com](#) *(Placeholder)*
*   **API Documentation:** [https://api.campussync.yourdomain.com/docs](#) *(Placeholder)*

---

*Designed and engineered for modern academic institutions. If you encounter any issues, please open an issue in the repository.*
