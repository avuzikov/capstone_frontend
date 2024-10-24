// src\pages\LoginPage.tsx

import React, { useEffect, useState } from 'react';
import Input from '../components/shared/Input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { jwtDecode } from 'jwt-decode';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate();
  const { login, role } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    try {
      const data = await login(email, password);
    } catch (error) {
      console.error('Login failed:', error);
      setLoginError('Invalid email or password. Please try again.');
    }
  };

  useEffect(() => {
    if (role) {
      //Redirect based on user role
      switch (role) {
        case 'admin':
          navigate('/admin');
          break;
        case 'hiring-manager':
          navigate('/manager/console');
          break;
        case 'applicant':
          navigate('/jobs');
          break;
        default:
          navigate('/jobs');
      }
    }
  }, [role]);

  return (
    <div className="flex justify-center items-center h-screen bg-adp-gray">
      <div className="card-filled p-large rounded-lg flex flex-col shadow-lg w-96">
        <h1 className="text-xl text-adp-navy text-center mb-4">Log In to the portal</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Input
            name="Email"
            placeholder="Introduce your email"
            type="email"
            error={loginError}
            isTextArea={false}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            name="Password"
            placeholder="Introduce your password"
            type="password"
            error={loginError}
            isTextArea={false}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button type="submit" className="btn-primary mt-medium">
            Log In
          </button>
          {loginError && <div className="mt-small text-danger">{loginError}</div>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
