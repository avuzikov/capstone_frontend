// src\components\shared\Header.tsx

import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout, role } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = () => {
    if (!token) {
      return [
        { to: '/jobs', text: 'Jobs' },
        { to: '/register', text: 'Register' },
        { to: '/login', text: 'Login' },
      ];
    }
    switch (role) {
      case 'applicant':
        return [
          { to: '/jobs', text: 'Jobs' },
          { to: '/applications', text: 'Applications' },
          { to: '/profile', text: 'Profile' },
        ];
      case 'hiring-manager':
        return [
          { to: '/jobs', text: 'Jobs' },
          { to: '/manager/console', text: 'Console' },
        ];
      case 'admin':
        return [
          { to: '/admin/dashboard', text: 'Dashboard' },
          { to: '/admin/jobs', text: 'Jobs' },
          { to: '/admin/users', text: 'Users' },
          { to: '/admin/managers', text: 'Managers' },
          { to: '/admin/tables', text: 'Tables' },
        ];
      default:
        return [];
    }
  };

  const linkClasses = `px-small py-small transition-colors duration-300 rounded-md`;
  const inactiveLinkClasses = `text-adp-white hover:bg-adp-white hover:text-adp-red`;
  const activeLinkClasses = `bg-adp-white text-adp-red shadow-md`;

  return (
    <nav className="flex bg-adp-red text-adp-white p-large justify-between items-center">
      <NavLink to={'/'}>
        <div className="flex items-center gap-3">
          <img src="/adp-white.svg" alt="Logo" className="img-small mb-small" />
          <h1 className="hidden md:block text-large">Talent Site</h1>
        </div>
      </NavLink>
      <ul className="flex gap-1 items-center">
        {navItems().map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end
              className={({ isActive }) =>
                `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`
              }
            >
              {item.text}
            </NavLink>
          </li>
        ))}
        {token && (
          <li>
            <button onClick={handleLogout} className={`${linkClasses} ${inactiveLinkClasses}`}>
              Logout
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
