// src/components/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/auth/useAuthContext';
import { Spinner } from 'react-bootstrap';

const ProtectedRoute = ({ element: Component }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}><Spinner animation="border" /></div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Component />;
};

export default ProtectedRoute;
