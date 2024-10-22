import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManagerManagementPage from './ManagerManagementPage';
import { AuthProvider } from '../../contexts/AuthContext'; // Adjust the import path as necessary
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter

test('renders ManagerManagementPage without error', () => {
  render(
    <AuthProvider>
      <Router>
        <ManagerManagementPage />
      </Router>
    </AuthProvider>
  );
});