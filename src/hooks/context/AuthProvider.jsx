import React, { createContext, useContext, useState, useEffect } from 'react';
import { FIREBASE_AUTH } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { getUserRole } from '../../utils/roles/getUserRole';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userEmail = user.email;
        console.log('User email:', userEmail);

        try {
          const userRole = await getUserRole(userEmail);
          setRole(userRole);
          console.log('User role:', userRole);
        } catch (error) {
          console.error('Error fetching user role:', error);
          setRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const value = {
    isAuthenticated,
    role,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);