import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AdminDashboardPage from './AdminDashboardPage';

test('renders AdminDashboardPage correctly', () => {
  render(<AdminDashboardPage />);

  // Check for the presence of the main heading
  expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();

  // Check for the presence of AdminDashboardCard components with specific titles
  expect(screen.getByText('Users')).toBeInTheDocument();
  expect(screen.getByText('Managers')).toBeInTheDocument();
  expect(screen.getByText('Tables')).toBeInTheDocument();
});