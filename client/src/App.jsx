// ─── App Router ────────────────────────────────────────────
// Purpose: Defines ALL routes (URLs) in the application.
// How React Router works:
//   - Each <Route> maps a URL path to a component
//   - <Outlet> in layouts renders child routes
//   - ProtectedRoute blocks unauthenticated access
//
// Route structure:
//   /login          → LoginPage (public)
//   /dashboard      → DashboardLayout → DashboardPage (protected)
//   /dashboard/...  → DashboardLayout → [module pages] (protected)
// ────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ComingSoonPage from './pages/ComingSoonPage';
import StudentsPage from './pages/StudentsPage';
import FacultyPage from './pages/FacultyPage';
import AttendancePage from './pages/AttendancePage';
import NoticePage from './pages/NoticePage';
import TimetablePage from './pages/TimetablePage';
import MarksPage from './pages/MarksPage';
import FeesPage from './pages/FeesPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast notifications — positioned top-right with custom styling */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--gray-900)',
              color: 'white',
              fontSize: '14px',
              borderRadius: '12px',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: 'white' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: 'white' },
            },
          }}
        />

        <Routes>
          {/* Public route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes — must be logged in */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/dashboard/students" element={<StudentsPage />} />
              <Route path="/dashboard/faculty" element={<FacultyPage />} />
              <Route path="/dashboard/attendance" element={<AttendancePage />} />
              <Route path="/dashboard/notices" element={<NoticePage />} />
              <Route path="/dashboard/timetable" element={<TimetablePage />} />
              <Route path="/dashboard/marks" element={<MarksPage />} />
              <Route path="/dashboard/fees" element={<FeesPage />} />
              <Route path="/dashboard/settings" element={<SettingsPage />} />
            </Route>
          </Route>

          {/* Redirect root to dashboard (or login if not authenticated) */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
