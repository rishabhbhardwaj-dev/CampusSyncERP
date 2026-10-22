# 🎓 CampusSync ERP

> A full-stack academic enterprise resource planning (ERP) system designed to streamline student admissions, faculty records, daily attendance tracking, grade submissions, weekly scheduling, and financial accounting through role-based access control.

[![Live Demo](https://img.shields.io/badge/Demo-Live%20Preview-57f1db?style=for-the-badge&logo=vercel&logoColor=black)](https://campus-sync-erp.vercel.app)
[![React](https://img.shields.io/badge/React%2019-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js%2024-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express%205-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma%20ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL%208-005C84?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)

---

## 📌 Project Overview

**CampusSync ERP** provides modern higher-education institutions with a unified administrative dashboard. It manages critical academic workflows across three distinct user roles:

- **Administrators (`ADMIN`):** Manage student admissions, faculty records, departmental structures, course assignments, institutional notices, and batch fee allocations.
- **Faculty Members (`FACULTY`):** Track daily classroom attendance, submit internal and semester examination marks, inspect weekly timetables, and publish announcements.
- **Students (`STUDENT`):** View attendance statistics with threshold alerts, review examination scorecards, inspect class schedules, download invoices, and initiate fee payments.

### Live Application
- **Production URL:** [https://campus-sync-erp.vercel.app](https://campus-sync-erp.vercel.app)
- **API Host:** `https://campussync-erp-backend.onrender.com` (routed via Vercel Edge proxy)

---

## 🖼️ Application Screenshots

### Dashboard & Student Management
| Overview Dashboard | Student Records & Enrollment |
| :---: | :---: |
| ![Dashboard](./Assets/Dashboard.png) | ![Student Management](./Assets/Student%20Management.png) |

### Attendance Tracking & Faculty Management
| Classroom Attendance | Faculty Roster |
| :---: | :---: |
| ![Attendance](./Assets/Attendance.png) | ![Faculty](./Assets/Faculty.png) |

### Authentication & Quick Login
| Secure Sign-In Portal |
| :---: |
| ![Login](./Assets/login.png) |

---

## ✨ Features by Role

### 🔐 Authentication & Session Security
- **JWT Cookie Flow:** Authentication tokens are stored in `httpOnly`, `SameSite=Lax` cookies to prevent client-side JavaScript access (XSS mitigation).
- **Active Verification:** Every incoming request verifies account status against the database (`user.isActive`), enabling immediate account deactivation.
- **Session Expiry Handling:** Axios response interceptor captures `401 Unauthorized` responses, flushes stale local cache, and displays an informative session-expired toast upon redirection.
- **One-Click Quick Login:** Pre-configured demo logins for Admin, Faculty, and Student roles on the sign-in page.

### 👨‍🎓 Student Management (SIS)
- **Atomic Registration:** Enrolls student user accounts and academic profiles concurrently using Prisma interactive transactions (`prisma.$transaction`).
- **Cryptographic Password Generation:** Generates temporary passwords using `crypto.randomBytes` and displays them in a one-time copyable modal.
- **Input Validation:** Enforces strict validation using `express-validator` on names, email formatting, semester ranges, and phone digit patterns.
- **Roster Filtering:** Server-side search across name, email, and enrollment number, combined with department and semester filters and structured pagination.

### 👩‍🏫 Faculty Administration
- **Staff Onboarding:** Admin-restricted registration capturing employee ID, academic qualifications, departmental designations, and joining dates.
- **Cascade Deletion:** Deleting a faculty member cleanly removes linked records across the relational schema.

### 📅 Attendance Tracking
- **Classroom Roster Renders:** Filter by course, semester, subject, and date to render the enrolled student roster.
- **One-Click Status Marking:** Toggle student attendance across `PRESENT`, `ABSENT`, and `LATE` states.
- **Composite Unique Constraints:** Database schema enforces `@@unique([studentId, subjectId, date])` to prevent duplicate daily records.
- **Student Analytics:** Calculates individual subject attendance percentages, applying warning badges when below 75%.

### 📊 Examination & Grade Management
- **Batch Evaluation:** Faculty submit classroom scores in a single request; the backend executes parallel atomic upserts inside a database transaction.
- **Unique Multi-Key Upsert:** Records map against compound key `[studentId, subjectId, examType, session]`.
- **Printable Transcripts:** Dedicated student scorecard view with print-optimized CSS (`@media print`).

### ⏰ Weekly Timetables
- **Schedule Viewer:** Timetable queries join course, subject, and faculty relations, grouped on the server by day of the week (`MONDAY` through `SATURDAY`).

### 💳 Fee Management & Accounting
- **Batch Fee Assignment:** Administrators assign semester fee structures (Tuition, Exam, Hostel, Library) across entire class rosters.
- **Payment Processing:** Increments paid amounts and transitions status through `UNPAID` $\rightarrow$ `PARTIAL` $\rightarrow$ `PAID`.
- **Student Invoices:** Breakdown of total fees paid versus pending balances, with printable fee receipts.

### 📢 Noticeboard & Announcements
- **Audience Targeting:** Announcements specify target recipients (`STUDENT`, `FACULTY`, or all users) with priority weighting (`LOW`, `MEDIUM`, `HIGH`).
- **Header Alerts:** Global top-bar notification bell displaying the latest institutional broadcasts.

---

## 🛠️ Technology Stack

### Frontend
| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | React | `^19.2.6` | Client-side user interface |
| **Build Tool** | Vite | `^8.0.12` | Bundler and local development server |
| **Routing** | React Router DOM | `^7.15.1` | Client-side routing, protected route guards |
| **Styling** | TailwindCSS | `^4.3.0` | Design tokens (`@theme`) and glassmorphic UI |
| **HTTP Client** | Axios | `^1.16.1` | API client with 15s timeout and 401 interceptor |
| **Visualization** | Recharts | `^3.8.1` | Dashboard trend charts |
| **Icons & UI** | React Icons / React Hot Toast | `^5.6.0` / `^2.6.0` | Iconography and user feedback notifications |

### Backend
| Component | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | v24 (v18+ compatible) | JavaScript server runtime |
| **Framework** | Express.js | `^5.2.1` | Modular HTTP API and routing |
| **Database ORM** | Prisma Client & CLI | `^5.22.0` | Type-safe queries, migrations, and schema modeling |
| **Database** | MySQL | v8.0+ | Relational data persistence (Aiven cloud in production) |
| **Authentication** | JSON Web Tokens (`jsonwebtoken`) | `^9.0.3` | Cryptographically signed session tokens |
| **Password Security** | `bcryptjs` | `^3.0.3` | Password hashing with 10 salt rounds |
| **Security Headers** | `helmet` | `^8.1.0` | HTTP response header security |
| **File Uploads** | `multer` | `^2.1.1` | Multipart form-data disk storage handling |
| **Validation** | `express-validator` | `^7.3.2` | Request parameter sanitization and rules |

---

## 🏗️ Architecture & Data Flow

CampusSync ERP uses a decoupled architecture deployed across two cloud environments. A Vercel Edge reverse proxy routes requests between the client and server.

```mermaid
flowchart TD
    subgraph Client["Client Tier"]
        Browser["Web Browser (Desktop / Mobile)"]
    end

    subgraph Edge["Edge Tier (Vercel)"]
        VercelSPA["Vercel SPA Hosting<br/>(campus-sync-erp.vercel.app)"]
        VercelProxy["Vercel Edge Rewrite Engine<br/>(/api/* -> Render Backend)"]
    end

    subgraph Backend["Application Tier (Render)"]
        Express["Express.js Server (:5000)<br/>(campussync-erp-backend.onrender.com)"]
        Middleware["Security & Auth Middleware<br/>(Helmet, CORS, CookieParser, JWT)"]
        Modules["Modular API Controllers & Services<br/>(Auth, Students, Faculty, Marks, etc.)"]
        Prisma["Prisma ORM Client Singleton"]
    end

    subgraph Database["Database Tier (Aiven)"]
        MySQL[("Managed Cloud MySQL Database<br/>(13 Relational Tables)")]
    end

    Browser -->|"1. Static Assets (HTTPS)"| VercelSPA
    Browser -->|"2. Same-Origin API Calls (/api/*)<br/>Cookie: token (SameSite=Lax)"| VercelProxy
    VercelProxy -->|"3. Proxied HTTPS Server-to-Server"| Express
    Express --> Middleware
    Middleware --> Modules
    Modules --> Prisma
    Prisma -->|"4. Connection Pool / Queries (SSL)"| MySQL
```

### Why the Reverse Proxy Architecture Was Introduced
When the frontend and backend are hosted on separate domains (`*.vercel.app` vs `*.onrender.com`), modern mobile browsers (such as iOS Safari via Intelligent Tracking Prevention) classify cross-domain authentication cookies as third-party and block them.

To resolve this without storing sensitive tokens in `localStorage` or acquiring a shared custom domain:
1. `client/vercel.json` configures an edge rewrite:
   ```json
   {
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://campussync-erp-backend.onrender.com/api/:path*"
       },
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
2. The browser sends API requests directly to `https://campus-sync-erp.vercel.app/api/*`.
3. Because the request target matches the origin in the browser address bar, the browser treats the authentication cookie as **first-party** (`SameSite=Lax`).
4. Vercel forwards the request over HTTPS to Render, preserving the `Cookie` header.

---

## 📂 Repository Structure

```text
CampusSyncERP/
├── Assets/                                # Application screenshots
│   ├── Attendance.png
│   ├── Dashboard.png
│   ├── Faculty.png
│   ├── login.png
│   └── Student Management.png
│
├── client/                                # Frontend application (React 19 + Vite)
│   ├── public/                            # Static public assets and SVG icons
│   ├── src/
│   │   ├── assets/                        # Component assets
│   │   ├── components/                    # Reusable components (ProtectedRoute.jsx)
│   │   ├── context/                       # Global state (AuthContext.jsx)
│   │   ├── layouts/                       # DashboardLayout.jsx (Header, Sidebar, Search)
│   │   ├── pages/                         # Route pages (Students, Faculty, Marks, etc.)
│   │   ├── services/                      # Axios API service layer (api.js, authService.js)
│   │   ├── App.jsx                        # React Router configuration
│   │   ├── index.css                      # TailwindCSS 4 `@theme` and custom utilities
│   │   └── main.jsx                       # React entry point
│   ├── vercel.json                        # Edge reverse-proxy rewrite rules
│   └── vite.config.js                     # Vite build and local dev proxy configuration
│
├── server/                                # Backend REST API (Node.js + Express 5)
│   ├── src/
│   │   ├── config/                        # App config (cors.js, db.js, env.js)
│   │   ├── middleware/                    # Middleware (auth.js, rbac.js, errorHandler.js)
│   │   ├── modules/                       # Feature modules (controllers, routes, services)
│   │   │   ├── academic/                  # Departments, courses, and subjects
│   │   │   ├── attendance/                # Daily attendance tracking
│   │   │   ├── auth/                      # Authentication and password management
│   │   │   ├── dashboard/                 # Aggregated overview metrics
│   │   │   ├── documents/                 # File uploads and metadata
│   │   │   ├── faculty/                   # Staff administration
│   │   │   ├── fees/                      # Fee structures and payments
│   │   │   ├── marks/                     # Examination evaluations
│   │   │   ├── notices/                   # Targeted broadcast board
│   │   │   ├── students/                  # Student registration and records
│   │   │   ├── timetable/                 # Class schedules
│   │   │   └── users/                     # User profile settings
│   │   ├── prisma/                        # Database schema and seeders
│   │   │   ├── schema.prisma              # 13 relational Prisma models
│   │   │   ├── seed.js                    # Core seed (Admin, Faculty, Student, Subjects)
│   │   │   └── seedStudents.js            # Batch student seeder (15 sample records)
│   │   ├── utils/                         # Utilities (apiResponse.js, apiError.js, pagination.js)
│   │   ├── app.js                         # Express middleware and route mounting
│   │   └── server.js                      # Server startup and database connection lifecycle
│   ├── uploads/                           # Local disk storage for document uploads
│   ├── seed-subjects.js                   # CSE & ECE subject seeder
│   └── seed-timetable.js                  # Timetable schedule seeder
│
├── mysql_init.txt                         # Local MySQL root user helper
└── README.md
```

---

## ⚙️ Prerequisites & Local Setup

### Prerequisites
- **Node.js:** v18.0.0 or higher (v24 recommended)
- **Package Manager:** `npm` v9+
- **Database:** MySQL v8.0 or higher running locally or accessible via cloud (e.g., Aiven)

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/rishabhbhardwaj-dev/CampusSyncERP.git
cd CampusSyncERP
```

---

### Step 2: Configure the Backend

1. Navigate to the server directory and install dependencies:
   ```bash
   cd server
   npm install
   ```

2. Create a `.env` file in `server/.env`:
   ```env
   # Set to 5005 to match client/vite.config.js local proxy target
   PORT=5005
   NODE_ENV=development
   DATABASE_URL="mysql://root:your_mysql_password@localhost:3306/campussync"
   JWT_SECRET="your_secure_development_jwt_secret"
   JWT_EXPIRES_IN="7d"
   COOKIE_MAX_AGE=604800000
   CLIENT_URL="http://localhost:5173"
   ```

3. Initialize database tables and run baseline seed scripts:
   ```bash
   # Push Prisma schema to MySQL
   npx prisma db push --schema=src/prisma/schema.prisma

   # Seed default Admin, Faculty, Student, Departments, and Courses
   npm run prisma:seed

   # (Optional) Seed 15 additional students, full semester subjects, and timetables
   node src/prisma/seedStudents.js
   node seed-subjects.js
   node seed-timetable.js
   ```

4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The API will start at `http://localhost:5005` (Health check: `http://localhost:5005/api/health`).*

---

### Step 3: Configure the Frontend

1. Open a new terminal window, navigate to `client/`, and install dependencies:
   ```bash
   cd client
   npm install
   ```

2. Verify local proxy configuration:  
   [client/vite.config.js](file:///d:/Dekstop/CampusSync%20ERP/client/vite.config.js) is configured to forward `/api` requests to `http://localhost:5005`:
   ```javascript
   server: {
     port: 5173,
     proxy: {
       '/api': {
         target: 'http://localhost:5005',
         changeOrigin: true,
       },
     },
   }
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will launch at `http://localhost:5173`.*

---

## 🔑 Default Seeded Credentials

After running `npm run prisma:seed`, the following accounts are available for testing:

| Role | Email Address | Password | Permissions |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `admin@campussync.com` | `admin123` | Full access to all modules and configurations |
| **Faculty Member** | `faculty@campussync.com` | `faculty123` | Attendance tracking, marks grading, notices, timetable |
| **Student** | `student@campussync.com` | `student123` | Attendance stats, personal grades, invoices, timetable |

---

## 🔌 API Route Directory

All responses conform to a standardized JSON envelope:

```json
{
  "success": true,
  "message": "Students fetched successfully",
  "data": [],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Registered Endpoints

| Resource Group | Method | Path | Description | Access Tier |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/login` | Validates credentials; sets `token` cookie | Public |
| | `POST` | `/api/auth/register` | Provisions new user with role profile | Admin only |
| | `POST` | `/api/auth/logout` | Clears `token` cookie | Authenticated |
| | `GET` | `/api/auth/me` | Fetches current user profile | Authenticated |
| | `PUT` | `/api/auth/change-password` | Updates authenticated user password | Authenticated |
| **Students** | `GET` | `/api/students` | Lists students with search, filters, and pagination | Admin, Faculty |
| | `GET` | `/api/students/stats` | Aggregated count by semester and department | Admin, Faculty |
| | `GET` | `/api/students/:id` | Detailed profile with attendances and marks | Admin, Faculty, or Own Profile |
| | `POST` | `/api/students` | Validates and creates student with temp password | Admin only |
| | `PUT` | `/api/students/:id` | Updates student profile fields | Admin only |
| | `DELETE`| `/api/students/:id` | Deletes student and cascades linked user | Admin only |
| **Faculty** | `GET` | `/api/faculty` | Lists faculty members with search and pagination | Admin only |
| | `POST` | `/api/faculty` | Creates new faculty and linked user | Admin only |
| | `DELETE`| `/api/faculty/:id` | Deletes faculty member | Admin only |
| **Academic** | `GET` | `/api/academic/departments`| Lists academic departments with counts | Authenticated |
| | `GET` | `/api/academic/courses` | Lists degree courses filtered by department | Authenticated |
| | `GET` | `/api/academic/subjects`| Lists subjects filtered by course and semester | Authenticated |
| **Attendance** | `GET` | `/api/attendance` | Returns attendance for date and subject | Authenticated |
| | `GET` | `/api/attendance/stats` | Returns student subject attendance percentages | Authenticated |
| | `POST` | `/api/attendance` | Marks attendance status for a student | Admin, Faculty |
| | `PUT` | `/api/attendance/:id` | Updates attendance status | Admin, Faculty |
| | `DELETE`| `/api/attendance/:id` | Removes attendance record | Admin, Faculty |
| **Marks** | `GET` | `/api/marks` | Retrieves scores for course, sem, subject, exam | Authenticated |
| | `GET` | `/api/marks/my-marks` | Student's personal grade history | Authenticated |
| | `POST` | `/api/marks` | Batch upsert student marks in transaction | Admin, Faculty |
| **Timetable** | `GET` | `/api/timetable` | Retrieves weekly schedule grouped by day | Authenticated |
| **Fees** | `GET` | `/api/fees` | Lists fee records for course and semester | Admin only |
| | `GET` | `/api/fees/my-fees` | Student's personal invoices and status | Authenticated |
| | `POST` | `/api/fees` | Assigns fee item to student | Admin only |
| | `POST` | `/api/fees/:id/pay` | Records full or partial fee payment | Admin, Student |
| **Notices** | `GET` | `/api/notices` | Fetches announcements filtered by user role | Authenticated |
| | `POST` | `/api/notices` | Publishes notice with priority and audience | Admin, Faculty |
| | `DELETE`| `/api/notices/:id` | Deletes announcement | Admin, Faculty |
| **Documents** | `GET` | `/api/documents` | Lists uploaded files filtered by course/sem | Authenticated |
| | `POST` | `/api/documents/upload` | Uploads file up to 10MB via Multer | Authenticated |
| | `DELETE`| `/api/documents/:id` | Deletes file (uploader or Admin) | Authenticated |
| **Users** | `PUT` | `/api/users/profile` | Updates name and phone | Authenticated |
| | `PUT` | `/api/users/change-password` | Validates old password and hashes new | Authenticated |
| **System** | `GET` | `/api/health` | Service uptime and timestamp check | Public |

---

## 🔒 Security Architecture

1. **Defense-in-Depth Authorization:**
   - **Authentication:** `authenticate` middleware verifies the signed JWT and queries the database to confirm the user account is active.
   - **Role-Based Access Control (RBAC):** `authorize('ADMIN', 'FACULTY')` guards privileged operations.
   - **Object-Level Access Control (ABAC):** `authorizeStudentAccess` ensures student users can only inspect their own profile records, preventing Insecure Direct Object References (IDOR).
2. **Transaction Integrity:** Interactive Prisma transactions wrap multi-table write operations (e.g., creating a `User` alongside a `Student` or batch-upserting marks) to guarantee ACID compliance.
3. **Database Error Handling:** Global error handler translates Prisma runtime codes (e.g., `P2002` duplicate unique constraints $\rightarrow$ HTTP 409 Conflict) into user-friendly JSON responses without exposing raw stack traces in production.
4. **Input Sanitization:** String trimming, email normalization, integer ranges, and regex checks are run on incoming requests via `express-validator`.

---

## ⚠️ Known Implementation Limitations

To maintain accurate technical documentation, the following implementation details should be noted:

1. **Frontend Document Center Route Registration:** [client/src/pages/DocumentsPage.jsx](file:///d:/Dekstop/CampusSync%20ERP/client/src/pages/DocumentsPage.jsx) is implemented, and the navigation link appears in the sidebar. However, `<Route path="/dashboard/documents" ... />` is not registered in [client/src/App.jsx](file:///d:/Dekstop/CampusSync%20ERP/client/src/App.jsx), causing navigation to redirect back to `/dashboard`.
2. **Attendance Faculty Foreign Key Reference:** In [server/src/modules/attendance/attendance.controller.js:L99](file:///d:/Dekstop/CampusSync%20ERP/server/src/modules/attendance/attendance.controller.js#L99), `create` sets `facultyId: req.user.id`. In the relational schema, `Attendance.facultyId` references `Faculty.id`. If a user's `User.id` differs from their autoincrement `Faculty.id`, a foreign key constraint violation will occur.
3. **Local Development Port Configuration:** [client/vite.config.js](file:///d:/Dekstop/CampusSync%20ERP/client/vite.config.js) proxies `/api` to `http://localhost:5005`, while [server/src/config/env.js](file:///d:/Dekstop/CampusSync%20ERP/server/src/config/env.js) defaults to `PORT=5000`. Developers running locally should specify `PORT=5005` in `server/.env` to align with the Vite proxy.
4. **Hardcoded Document Download URLs:** Preview and download links in `DocumentsPage.jsx` use `http://localhost:5005${doc.fileUrl}` instead of an environment variable or relative proxy path.
5. **Dashboard Analytics Scope:** For `ADMIN`, metrics (`totalStudents`, `totalFaculty`, `totalDepartments`, `recentNotices`) are dynamically calculated from database queries. For `STUDENT` and `FACULTY` roles, some dashboard KPI cards currently display static placeholder values.
6. **Automated Test Coverage:** Automated testing frameworks (e.g., Jest, Vitest, Supertest) are not configured in `package.json`. Manual verification scripts are provided in the `server/` directory (`test-dashboard.js`, `test-token.js`, `test-sub.js`).

---

## 📄 License & Author

- **License:** ISC License (as specified in `server/package.json`).
- **Author:** [Rishabh Bhardwaj](https://github.com/rishabhbhardwaj-dev)
- **Portfolio:** [https://rishabh-portfolio-lac.vercel.app/](https://rishabh-portfolio-lac.vercel.app/)
- **LinkedIn:** [https://www.linkedin.com/in/rishabhbhardwaj-tech/](https://www.linkedin.com/in/rishabhbhardwaj-tech/)