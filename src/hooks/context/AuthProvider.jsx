import React, { createContext, useContext, useState, useEffect } from 'react';
import { FIREBASE_AUTH } from '../../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../firebase'
import {getUserRole} from '../../utils/roles/getUserRole';
import { useGlobalState } from '../global/useGlobalState';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const {users} = useGlobalState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
      if (user) {
        setIsAuthenticated(true);
        const userEmail = user.email;
        console.log('User email:', userEmail);

        const userRecord = users.find((user) => user.email === userEmail);
        if (userRecord) {
          const userRole = userRecord.role;
          setRole(userRole);
        } else {
          console.error('User not found in global state');
          setRole(null);
        }
      } else {
        setIsAuthenticated(false);
        setRole(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [users]);

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