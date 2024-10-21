import React from 'react';
import AdminDashboardPage from './AdminDashboardPage.tsx';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test('renders AdminDashboardPage', () => {
  render(
    <MemoryRouter>
      <AdminDashboardPage />
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/Admin Dashboard/i);
  expect(linkElement).toBeInTheDocument();
});



