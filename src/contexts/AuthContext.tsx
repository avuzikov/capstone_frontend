import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';


interface AuthContextProps {
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  getCookie: (name: string) => string | undefined;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);


export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();


  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const authToken = response.headers.get('Authorization');
        if (authToken) {
          setToken(authToken);
          // Guardar token en cookie o localStorage según tu preferencia
          document.cookie = `authToken=${authToken}; path=/`;

          // Redirigir a la página principal
          //navigate('/profile');
        } else {
          throw new Error('Token not found');
        }
      } else {
        throw new Error(data.message || 'Login failed');
      }
    } catch (error: any) {
      console.error('Login Error:', error.message);
      alert(`Error: ${error.message}`);
    }
  };

  // Función para manejar el logout
  const logout = () => {
    setToken(null);
    // Eliminar el token de las cookies o localStorage
    document.cookie = 'authToken=; Max-Age=0; path=/';
    navigate('/login');
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, getCookie }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook para usar el contexto en los componentes
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};