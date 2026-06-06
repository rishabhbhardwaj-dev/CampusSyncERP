// ─── Auth Context ──────────────────────────────────────────
// Purpose: Manages the global authentication state.
// Why: Multiple components need to know WHO is logged in and 
//      WHAT ROLE they have (admin/faculty/student). Instead of 
//      passing this data through every component as props, 
//      Context makes it available everywhere with useAuth().
//
// How it works:
//   1. On app load → checks localStorage for saved user data
//   2. On login → saves user to state + localStorage
//   3. On logout → clears everything
//   4. Any component can call: const { user, login, logout } = useAuth()
// ────────────────────────────────────────────────────────────

import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: check if user was previously logged in
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const response = await authService.login(email, password);
    if (response.success) {
      const userData = response.data.user;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success(`Welcome back, ${userData.name}!`);
    }
    return response;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      // Even if API fails, clear local state
    }
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  const value = {
    user,        // Current user object (null if not logged in)
    loading,     // True while checking initial auth state
    login,       // Function to log in
    logout,      // Function to log out
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    isFaculty: user?.role === 'FACULTY',
    isStudent: user?.role === 'STUDENT',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook — any component can use: const { user, login } = useAuth()
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
