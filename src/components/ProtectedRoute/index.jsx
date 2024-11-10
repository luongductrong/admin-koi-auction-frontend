import React from 'react';
import { Navigate } from 'react-router-dom';
import userStore from '../../zustand';

const ProtectedRoute = ({ children }) => {
  const { user } = userStore();
  const isAuthenticated = user.isAuthenticated;
  const role = user.role;

  console.log('render ProtectedRoute');

  if (!isAuthenticated || role !== 'Admin') {
    return <Navigate to="/401" />;
  }
  return children;
};

export default React.memo(ProtectedRoute);
