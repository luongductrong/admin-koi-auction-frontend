import React from 'react';
import { Routes, Route, BrowserRouter as Router, Navigate } from 'react-router-dom';
import DefaultLayout from '../components/Layout/DefaultLayout';
import AnotherLayout from '../components/Layout/AnotherLayout';

import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import User from '../pages/User';
import Setting from '../pages/Setting';
import Chart from '../pages/Chart';
import Task from '../pages/Task';
import Order from '../pages/Order';
import Chat from '../pages/Chat';
import Email from '../pages/Email';
import Profile from '../pages/Profile';
import Request from '../pages/Request';
import Blog from '../pages/Blog';
import Requirement from '../pages/Requirement';
import Rule from '../pages/Rule';
import { AuthProvider, useAuth } from '../auth/AuthProvider'; // Import AuthProvider

// PrivateRoute để kiểm tra xác thực
const PrivateRoute = ({ element }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Hiển thị trong quá trình kiểm tra token
  }

  return isAuthenticated ? element : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Unrequired-auth put here*/}
      <Route path="/login" element={<Login />} />

      {/* Require-auth put here*/}
      <Route element={<DefaultLayout />}>
        <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
        <Route path="/chart" element={<PrivateRoute element={<Chart />} />} />
        <Route path="/user" element={<PrivateRoute element={<User />} />} />
        <Route path="/setting" element={<PrivateRoute element={<Setting />} />} />
        <Route path="/task" element={<PrivateRoute element={<Task />} />} />
        <Route path="/order" element={<PrivateRoute element={<Order />} />} />
        <Route path="/chat" element={<PrivateRoute element={<Chat />} />} />
        <Route path="/email" element={<PrivateRoute element={<Email />} />} />
        <Route path="/profile" element={<PrivateRoute element={<Profile />} />} />
        <Route path="/request" element={<PrivateRoute element={<Request />} />} />
        <Route path="/blog" element={<PrivateRoute element={<Blog />} />} />
        <Route path="/rule" element={<PrivateRoute element={<Rule />} />} />
        <Route path="/requirement" element={<PrivateRoute element={<Requirement />} />} />
      </Route>
      {/* Route cho layout khác */}
      <Route
        path="/another"
        element={
          <PrivateRoute
            element={
              <AnotherLayout>
                <div>Another Page Content</div>
              </AnotherLayout>
            }
          />
        }
      />

      <Route path="*" element={<PrivateRoute element={<Navigate to="/" />} />} />
    </Routes>
  );
};

export default AppRoutes;
