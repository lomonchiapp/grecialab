import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/context/AuthProvider';
import { signOut } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import {Loading} from '../components/Loading';
import { hasRequiredRole } from '../utils/roleUtils';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { isAuthenticated, role, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />; // Use a more sophisticated loading component
  }

  if (!isAuthenticated || role == null) {
    signOut(FIREBASE_AUTH);
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !hasRequiredRole(role, allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};