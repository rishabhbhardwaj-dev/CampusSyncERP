# 🎓 CampusSync ERP

> A Full-Stack College ERP System

**CampusSync ERP** is a full-stack college ERP platform designed to streamline student management, faculty coordination, attendance, academic records, timetables, and administrative workflows through role-based access control.

## 🌐 Live Demo

**[campus-sync-erp.vercel.appp](https://campus-sync-erp.vercel.app)**

## 🚀 Key Features

- **Student Management** — Manage student records and academic information
- **Faculty Management** — Manage faculty profiles and academic assignments
- **Attendance System** — Track and manage student attendance
- **Academic Dashboard** — Role-based dashboards for different users
- **Timetable Management** — Manage academic schedules and timetables
- **Subject & Course Management** — Organize subjects and academic data
- **Role-Based Access Control (RBAC)** — Secure authentication and authorization
- **File Uploads** — Support for uploading and managing files
- **Pagination & Search** — Efficient data retrieval and navigation
- **Responsive UI** — Designed for desktop, tablet, and mobile screens

## 🛠️ Tech Stack

### Frontend

![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

### Database

![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)

### Authentication, Tools & Deployment

![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

## 🏗️ System Architecture

```text
                         CampusSync ERP
                               │
                ┌──────────────┴──────────────┐
                │                             │
             CLIENT                         SERVER
          React + Vite                  Node + Express
                │                             │
       ┌────────┼────────┐           ┌────────┼─────────┐
       │        │        │           │        │         │
     Pages  Components Context     Config  Middleware Modules
       │        │        │                    │         │
       └────────┴────────┘                    │      Prisma
                │                             │
                └──────────── API ────────────┘
                                              │
                                            MySQL
```

## 📂 Project Structure

```text
CampusSyncERP/
│
├── Assets/                         # Project screenshots
│   ├── Attendance.png
│   ├── Dashboard.png
│   ├── Faculty.png
│   ├── login.png
│   └── Student Management.png
│
├── client/                         # Frontend - React + Vite
│   ├── public/                     # Public static assets
│   │
│   ├── src/
│   │   ├── assets/                 # Frontend assets
│   │   ├── components/             # Reusable UI components
│   │   ├── context/                # React context providers
│   │   ├── layouts/                # Application layouts
│   │   ├── pages/                  # Page-level components
│   │   ├── services/               # API/service layer
│   │   ├── App.jsx                 # Root application component
│   │   ├── index.css               # Global styles
│   │   └── main.jsx                # Application entry point
│   │
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── README.md
│   ├── vercel.json
│   └── vite.config.js
│
├── server/                         # Backend - Node.js + Express
│   ├── src/
│   │   ├── config/                 # Application configuration
│   │   ├── middleware/             # Authentication & middleware
│   │   ├── modules/                # Feature modules
│   │   ├── prisma/                 # Prisma configuration/schema
│   │   ├── utils/                  # Shared backend utilities
│   │   │   ├── apiError.js
│   │   │   ├── apiResponse.js
│   │   │   └── pagination.js
│   │   │
│   │   ├── app.js                  # Express application setup
│   │   └── server.js               # Server entry point
│   │
│   ├── uploads/                    # Uploaded files
│   ├── .gitignore
│   ├── add-sub.js
│   ├── package.json
│   ├── package-lock.json
│   ├── seed-subjects.js
│   ├── seed-timetable.js
│   ├── test-dashboard.js
│   ├── test-sub.js
│   ├── test-token.js
│   ├── test.js
│   ├── mysql_init.txt
│   └── README.md
│
└── README.md
```

> `node_modules`, build output, and environment files are intentionally excluded from the project structure shown above.

## 🖼️ Screenshots

### Dashboard & Student Management

| Dashboard | Student Management |
|-----------|--------------------|
| ![Dashboard](./Assets/Dashboard.png) | ![Student Management](./Assets/Student%20Management.png) |

### Attendance & Faculty

| Attendance | Faculty |
|------------|---------|
| ![Attendance](./Assets/Attendance.png) | ![Faculty](./Assets/Faculty.png) |

### Login

![Login](./Assets/login.png)

## ⚙️ Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js v18 or above
- npm
- MySQL v8 or above

### 1. Clone the Repository

```bash
git clone https://github.com/rishabhbhardwaj-dev/CampusSyncERP.git
cd CampusSyncERP
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
DATABASE_URL="mysql://root:password@localhost:3306/campussync"
JWT_SECRET="your_jwt_secret"
PORT=5000
```

> Replace the database credentials and JWT secret with your own values.

### 3. Setup the Database

Run the Prisma migration:

```bash
npx prisma migrate dev
```

Seed the required data:

```bash
node seed-subjects.js
node seed-timetable.js
```

### 4. Start the Backend

```bash
npm run dev
```

The backend API will be available at:

```text
http://localhost:5000
```

### 5. Setup the Frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:5173
```

## 🔌 API Architecture

The backend follows a modular API structure with centralized response formatting, error handling, authentication, and pagination utilities.

### Response Format

```json
{
  "success": true,
  "message": "Data fetched successfully",
  "data": {},
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100
  }
}
```

### Main API Modules

```text
/api/
├── auth/           # Authentication
├── students/       # Student management
├── faculty/        # Faculty management
├── attendance/     # Attendance management
├── subjects/       # Subject management
├── timetable/      # Timetable management
└── dashboard/      # Dashboard data
```

## 🌐 Deployment

The frontend is configured for deployment with **Vercel**.



## 🌐 Deployment

Deployed on **Vercel**.

**[🔗 Live URL](https://campus-sync-erp-3p4u.vercel.app)**



## 🔮 Future Enhancements

- Real-time notifications
- Advanced analytics and reporting
- Mobile application
- Multi-language support
- Cloud-based file storage
- Email integration

## 👨‍💻 Author

**Rishabh Bhardwaj**

- **Portfolio:** https://rishabh-portfolio-lac.vercel.app/
- **GitHub:** https://github.com/rishabhbhardwaj-dev
- **LinkedIn:** https://www.linkedin.com/in/rishabhbhardwaj-tech/

## 📄 License

This project is created and maintained by **Rishabh Bhardwaj**.