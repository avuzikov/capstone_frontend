// src\contexts\AuthContext.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  id: string | null;
  role: string | null;
  login: (email: string, password: string) => Promise<{ token: string; role: string; id: string }>; // Modified return type
  logout: () => void;
  setData: (token: string, role: string, id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('authToken'));
  const [role, setRole] = useState<string | null>(localStorage.getItem('userRole'));
  const [id, setId] = useState<string | null>(localStorage.getItem('userId'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('authToken', token);
    } else {
      localStorage.removeItem('authToken');
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

  const setData = (token: string, role: string, id: string) => {
    setToken(token);
    setRole(role);
    setId(id);
  };

  const login = async (email: string, password: string) => {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      setToken(data.token);
      setRole(data.role);
      setId(data.id);
      return { token: data.token, role: data.role, id: data.id }; // Return the data
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
    <AuthContext.Provider value={{ token, id, role, login, logout, setData }}>
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
