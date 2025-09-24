// File: src/components/ProtectedRoute.tsx
import React, { type ReactNode } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, setShowAuthModal } = useAuth();

  if (!isAuthenticated) {
    setShowAuthModal(true);
    return null; // Don't render children until authenticated
  }

  return <>{children}</>;
};

export default ProtectedRoute;
