// ─── Express App Setup ──────────────────────────────────────
// Purpose: Configures the Express application with all middleware and routes.
// Why separate from server.js? 
//   - app.js = configuration (testable, importable)
//   - server.js = actually starts listening (the entry point)
//   This separation allows you to import `app` in tests without starting the server.

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('path');
const corsOptions = require('./config/cors');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// ─── Global Middleware ──────────────────────────────────────
// Order matters! These run on EVERY request, top to bottom.

app.use(helmet());           // Sets security-related HTTP headers (XSS, clickjacking protection)
app.use(cors(corsOptions));  // Enable CORS for frontend
app.use(morgan('dev'));      // Request logging (method, url, status, response time)
app.use(express.json());     // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(cookieParser());     // Parse cookies (where JWT lives)

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// ─── API Routes ─────────────────────────────────────────────
// Each module registers its own routes under a prefix.

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/students', require('./modules/students/student.routes'));
app.use('/api/faculty', require('./modules/faculty/faculty.routes'));
app.use('/api/academic', require('./modules/academic/academic.routes'));
app.use('/api/attendance', require('./modules/attendance/attendance.routes'));
app.use('/api/dashboard', require('./modules/dashboard/dashboard.routes'));
app.use('/api/notices', require('./modules/notices/notice.routes'));
app.use('/api/marks', require('./modules/marks/marks.routes'));
app.use('/api/timetable', require('./modules/timetable/timetable.routes'));
app.use('/api/fees', require('./modules/fees/fees.routes'));
app.use('/api/users', require('./modules/users/users.routes'));
app.use('/api/documents', require('./modules/documents/document.routes'));

// Health check endpoint — useful for deployment monitoring
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── 404 Handler ────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ───────────────────────────────────
// MUST be last — Express identifies error handlers by their 4 parameters.
app.use(errorHandler);

module.exports = app;
