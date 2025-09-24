import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  login: (token: string, username: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [showAuthModal, setShowAuthModal] = useState(false);

  const isAuthenticated = !!token;

  const login = (newToken: string, username: string) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
    setShowAuthModal(false);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  useEffect(() => {
    // Check token validity on mount (optional, can add token expiration check here)
  }, []);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      token,
      showAuthModal,
      setShowAuthModal,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
