# 🎓 CampusSync ERP

> **A Modern, Enterprise-Grade College ERP System**

CampusSync ERP is a comprehensive, full-stack Educational Resource Planning platform designed to digitalize and streamline campus operations. Built with a modern tech stack and featuring a sleek dark enterprise dashboard, it provides distinct role-based portals to bridge the gap between administrators, faculty, and students seamlessly.

---

## ✨ Features

- **Authentication & Role-Based Access**: Secure JWT-based login with distinct authorization levels for Admin, Faculty, and Students.
- **Dashboard Analytics**: Real-time insights and KPIs for overall campus operations, student demographics, and attendance trends.
- **Student Management**: End-to-end student lifecycle tracking, enrollment management, and detailed academic profiles.
- **Faculty Management**: Comprehensive faculty directory, department assignments, and subject allocation.
- **Attendance Tracking**: Intuitive, daily attendance marking system with automated shortage alerts and percentage calculations.
- **Timetable Management**: Dynamic class scheduling, room allocation, and automated faculty routing.
- **Marks Management**: Complete examination workflow from internal grading to final scorecard generation.
- **Fee Management**: Track pending dues, process fee transactions, and monitor overall financial collections.
- **Notice Management**: Centralized announcement system with role-specific and department-specific targeting.
- **Document Management**: Secure digital vault for uploading and sharing study materials, assignments, and administrative files.

---

## 🛠️ Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS (Dark Enterprise Theme)
- React Router DOM v7
- Recharts (Data Visualization)
- React Hot Toast & React Icons

**Backend**
- Node.js
- Express.js
- Prisma ORM
- JWT & bcryptjs (Security)
- Multer (File Handling)
- Express Validator

**Database**
- MySQL

---

## 🏗️ System Architecture

CampusSync is built on a highly scalable Client-Server architecture:
1. **Client**: A fast, responsive Single Page Application (SPA) built with React and Vite.
2. **API Layer**: RESTful APIs powered by Node.js and Express.js, following a strictly decoupled `Routes -> Validator -> Controller -> Service` design pattern.
3. **Data Layer**: MySQL database managed via Prisma ORM for type-safe database interactions and automated migrations.

---

## 📂 Project Structure

```text
CampusSync/
├── client/                     # React Frontend Application
│   ├── src/
│   │   ├── components/         # Reusable UI components (Buttons, Modals, Forms)
│   │   ├── context/            # React Context (AuthContext)
│   │   ├── layouts/            # Dashboard & Page Layouts
│   │   ├── pages/              # Module Views (Dashboard, Students, Attendance, etc.)
│   │   ├── services/           # Axios API service wrappers
│   │   └── index.css           # Global styles and Tailwind configs
│   ├── package.json
│   └── vite.config.js
├── server/                     # Node.js Express Backend
│   ├── prisma/                 # Prisma Schema, Migrations, and Seeders
│   ├── src/
│   │   ├── config/             # Environment and CORS configurations
│   │   ├── middleware/         # Auth verification, Error Handling, File Uploads
│   │   ├── modules/            # Domain-driven feature modules (auth, students, attendance)
│   │   ├── utils/              # Helper utilities
│   │   └── server.js           # Express App Entry Point
│   ├── .env                    # Environment variables
│   └── package.json
└── README.md
```

---

## 📸 Screenshots

| Login Page | Dashboard |
| :---: | :---: |
| ![Login Page](./assets/login.png) | ![Dashboard](./assets/Dashboard.png) |

| Student Management | Faculty Management |
| :---: | :---: |
| ![Students](./assets/Student%20Management.png) | ![Faculty](./assets/Faculty.png) |

| Attendance Module |
| :---: |
| ![Attendance](./assets/Attendance.png) |

---

## ⚙️ Installation Guide

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/CampusSync.git
cd CampusSync
```

### 2. Backend Setup
```bash
cd server
npm install

# Setup your environment variables (see next section)

# Generate Prisma Client & Run Migrations
npx prisma generate
npx prisma migrate dev --name init

# Seed the database (Optional)
npm run prisma:seed

# Start the Backend Server
npm run dev
```

### 3. Frontend Setup
```bash
cd ../client
npm install

# Start the Vite Development Server
npm run dev
```
The application will be running at `http://localhost:5173`.

---

## 🔐 Environment Variables

Create a `.env` file in the `server` directory:

```env
# Database Configuration
DATABASE_URL="mysql://username:password@localhost:3306/campussync"

# Server Configuration
PORT=5000

# Authentication
JWT_SECRET="your_secure_jwt_secret"
```

---

## 🛣️ API Architecture Overview

The backend is structured around a modular feature-based architecture. Standard API responses are structured as:

```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": { ... }
}
```

**Key Modules & Routes:**
- **Auth Module:** `/api/auth` (Login, Profile)
- **Students Module:** `/api/students` (CRUD operations for students)
- **Faculty Module:** `/api/faculty` (CRUD operations for faculty)
- **Attendance Module:** `/api/attendance` (Mark and view attendance)
- **Marks Module:** `/api/marks` (Upload and retrieve exam scores)
- **Fees Module:** `/api/fees` (Manage student fee records)
- **Timetable Module:** `/api/timetable` (Class scheduling)

---

## 🚀 Future Enhancements

- Integration with a Payment Gateway (Stripe/Razorpay) for live fee collection.
- Automated Email/SMS notifications for absence and fee dues.
- Mobile Application using React Native.
- Advanced AI-powered analytics for predicting student performance.

---

## 👨‍💻 Author

**Your Name**  
*Full Stack Developer*  
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)
