// src\contexts\AuthContext.tsx

import { jwtDecode } from 'jwt-decode';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  id: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<{ token: string }>; // Modified return type
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [role, setRole] = useState<'applicant' | 'hiring-manager' | 'admin' | null >(localStorage.getItem('userRole') as 'applicant' | 'hiring-manager' | 'admin' | null);
  const [id, setId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (token) {
      const { userId, role } = jwtDecode(token) as { userId: string; role: 'applicant' | 'hiring-manager' | 'admin' };
      setRole(role);
      setId(userId);
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
      setRole(role);
      setId(id);
    }
  }, [token]);

  useEffect(() => {
    if (role) {
      localStorage.setItem('userRole', role);
    } else {
      localStorage.removeItem('userRole');
    }
  }, [role]);

  useEffect(() => {
    if (id) {
      localStorage.setItem('userId', id);
    } else {
      localStorage.removeItem('userId');
    }
  }, [id]);

  const login = async (email: string, password: string) => {
    const response = await fetch('http://localhost:8180/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      return { token: data.token }; // Return the data
    } else {
      throw new Error('Login failed');
    }
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setId(null);
  };

  return (
    <AuthContext.Provider value={{ token, id, role, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
