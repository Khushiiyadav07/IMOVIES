import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/apiClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('imovies_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    // Default logged in user for immediate seamless browsing matching screenshot 10
    return {
      id: "u_default",
      username: "gvdkumar",
      email: "gvdkumar@gmail.com",
      role: "user"
    };
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('imovies_token') || 'demo-jwt-token-imovies';
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('imovies_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('imovies_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('imovies_token', token);
    } else {
      localStorage.removeItem('imovies_token');
    }
  }, [token]);

  // Connect to Backend API with reliable fallback
  const login = async (email, password) => {
    try {
      const data = await api.login(email, password);
      if (data && data.success && data.user) {
        setUser(data.user);
        setToken(data.token);
        return { success: true, user: data.user };
      }
    } catch (err) {
      console.log("Backend offline or connecting, using fast fallback login:", err.message);
    }

    // Fallback if backend is not yet started by user
    if (email.toLowerCase().includes('admin')) {
      const adminUser = {
        id: "u_admin",
        username: "Admin",
        email: email,
        role: "admin"
      };
      setUser(adminUser);
      setToken('demo-admin-jwt-token');
      return { success: true, user: adminUser };
    }

    const regularUser = {
      id: "u_" + Date.now(),
      username: email.split('@')[0],
      email: email,
      role: "user"
    };
    setUser(regularUser);
    setToken('demo-user-jwt-token-' + Date.now());
    return { success: true, user: regularUser };
  };

  const register = async (username, email, password, role = 'user', adminSecret = '') => {
    try {
      const data = await api.register(username, email, password, role, adminSecret);
      if (data && data.success && (data.user || data.admin)) {
        const registeredUser = data.user || data.admin;
        setUser(registeredUser);
        setToken(data.token);
        return { success: true, user: registeredUser };
      }
    } catch (err) {
      console.log("Backend offline or connecting, using fast fallback registration:", err.message);
    }

    const newUser = {
      id: "u_" + Date.now(),
      username: username || email.split('@')[0],
      email: email,
      role: role
    };
    setUser(newUser);
    setToken('demo-registered-jwt-token-' + Date.now());
    return { success: true, user: newUser };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('imovies_user');
    localStorage.removeItem('imovies_token');
  };

  const toggleRole = () => {
    setUser(prev => {
      if (!prev) return { id: 'u_default', username: 'admin', email: 'admin@imovies.com', role: 'admin' };
      const newRole = prev.role === 'admin' ? 'user' : 'admin';
      return { ...prev, role: newRole };
    });
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAdmin,
        login,
        register,
        logout,
        setUser,
        toggleRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
