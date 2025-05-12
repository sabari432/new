// PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

// A Higher-Order Component to protect private routes
const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('token'); // Check for token in local storage

  // If not authenticated, redirect to login page
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
