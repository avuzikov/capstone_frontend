// src\components\admin\TableCard.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import TableCard from './TableCard';

describe('TableCard Component', () => {
  const sampleProps = {
    link: '/admin/tables/users',
    name: 'Users',
  };

  test('renders the TableCard component with correct props', () => {
    render(
      <Router>
        <TableCard {...sampleProps} />
      </Router>
    );

    // Check for Link component with correct 'to' attribute
    const linkElement = screen.getByRole('link');
    expect(linkElement).toHaveAttribute('href', sampleProps.link);

    // Check for the name
    const nameElement = screen.getByText(sampleProps.name);
    expect(nameElement).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(
      <Router>
        <TableCard {...sampleProps} />
      </Router>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
