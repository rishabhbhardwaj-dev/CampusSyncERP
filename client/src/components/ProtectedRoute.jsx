// ─── Protected Route Component ─────────────────────────────
// Purpose: A wrapper that blocks access to pages unless logged in.
// Why: Dashboard, student list, etc. should NOT be accessible 
//      if you're not logged in. This component checks auth state
//      and redirects to /login if needed.
//
// Usage in routes:
//   <Route element={<ProtectedRoute />}>
//     <Route path="/dashboard" element={<Dashboard />} />
//   </Route>
//
// allowedRoles: Optional. If specified, only those roles can access.
//   e.g., <ProtectedRoute allowedRoles={['ADMIN']} /> → only admins
// ────────────────────────────────────────────────────────────

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Still checking auth state — show nothing yet
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-[var(--primary-500)] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → redirect to dashboard (access denied)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // All good → render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
