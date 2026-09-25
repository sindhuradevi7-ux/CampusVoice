import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campusvoice_user');
      return stored && stored !== 'undefined' ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('campusvoice_token');
    return storedToken && storedToken !== 'null' && storedToken !== 'undefined' ? storedToken : null;
  });
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('campusvoice_token');
    localStorage.removeItem('campusvoice_user');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('campusvoice_token');
      if (storedToken && storedToken !== 'null' && storedToken !== 'undefined' && storedToken !== '') {
        try {
          const res = await authAPI.getMe();
          if (res.data?.success && res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('campusvoice_user', JSON.stringify(res.data.user));
          } else {
            logout();
          }
        } catch (error) {
          console.error('Session verification notice:', error.message);
          // Only clear if unauthenticated (401), not if network glitch / temporary cold start
          if (error.response?.status === 401) {
            logout();
          }
        }
      } else {
        logout();
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('campusvoice_token', receivedToken);
        localStorage.setItem('campusvoice_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true, user: receivedUser };
      }
      return { success: false, message: 'Invalid response from server.' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check your credentials.',
      };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authAPI.register(userData);
      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data;
        localStorage.setItem('campusvoice_token', receivedToken);
        localStorage.setItem('campusvoice_user', JSON.stringify(receivedUser));
        setToken(receivedToken);
        setUser(receivedUser);
        return { success: true, user: receivedUser };
      }
      return { success: false, message: 'Invalid response from server.' };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed. Please check form fields.',
      };
    }
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isStudent: user?.role === 'student',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
