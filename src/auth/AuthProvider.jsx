import axios from 'axios';
import React, { createContext, useState, useContext, useEffect } from 'react';

// Tạo Context cho xác thực
const AuthContext = createContext();

// Tạo Provider để bao bọc ứng dụng
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Giả sử có API để kiểm tra token hợp lệ
      axios
        .post('API check xem token còn hạn sử dụng không(nâng cao)', { token })
        .then((response) => {
          if (response.data.valid) {
            setIsAuthenticated(true);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          } else {
            // Xóa token nếu không hợp lệ
            localStorage.removeItem('token');
            setIsAuthenticated(false);
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
          setIsAuthenticated(false);
        });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
    delete axios.defaults.headers.common['Authorization'];
  };

  // Kiểm tra token trong localStorage khi khởi động ứng dụng
  React.useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return <AuthContext.Provider value={{ isAuthenticated, login, logout }}>{children}</AuthContext.Provider>;
};

// Tạo hook để sử dụng AuthContext
export const useAuth = () => useContext(AuthContext);
