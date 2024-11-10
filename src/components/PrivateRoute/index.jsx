import React from 'react';
import { Navigate } from 'react-router-dom';
import userStore from '../../zustand';

const PrivateRoute = ({ children }) => {
  const { user } = userStore();
  const isAuthenticated = user.isAuthenticated;
  const userRole = user.role;

  if (!isAuthenticated || (userRole !== 'Admin' && userRole !== 'Staff')) {
    return <Navigate to="/login" />;
  }
  console.log('render PrivateRoute');

  return children;
};

export default React.memo(PrivateRoute);
