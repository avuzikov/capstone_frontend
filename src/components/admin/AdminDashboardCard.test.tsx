// src/components/admin/AdminDashboardCard.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminDashboardCard from './AdminDashboardCard';

describe('AdminDashboardCard', () => {
  it('renders the title and children correctly', () => {
    const title = 'Test Title';
    const children = <div>Test Children</div>;
    const link = '/test-link';

    const { getByText } = render(
      <Router>
        <AdminDashboardCard title={title} link={link}>
          {children}
        </AdminDashboardCard>
      </Router>
    );

    expect(getByText('Test Title')).toBeInTheDocument();
    expect(getByText('Test Children')).toBeInTheDocument();
  });

  it('renders the link correctly', () => {
    const title = 'Test Title';
    const children = <div>Test Children</div>;
    const link = '/test-link';

    const { container } = render(
      <Router>
        <AdminDashboardCard title={title} link={link}>
          {children}
        </AdminDashboardCard>
      </Router>
    );

    const anchorElement = container.querySelector('a');
    expect(anchorElement).toHaveAttribute('href', link);
  });
});
