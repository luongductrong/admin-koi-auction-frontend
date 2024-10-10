import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context cho xác thực
const AuthContext = createContext();

// Tạo Provider để bao bọc ứng dụng
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // Trạng thái tạm trong khi kiểm tra xác thực

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Kiểm tra token trong localStorage khi khởi động ứng dụng
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>{children}</AuthContext.Provider>;
};

// Tạo hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
