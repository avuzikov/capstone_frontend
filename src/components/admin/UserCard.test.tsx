// src\components\admin\UserCard.test.tsx

import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import UserCard from './UserCard';
import { User } from '../../types/types';

const mockUser: User = {
  id: 1,
  fullName: 'Jane Doe',
  email: 'jane.doe@example.com',
  password: 'password',
  role: 'applicant',
  phone: '987-654-3210',
};

describe('UserCard', () => {
  it("renders the user's full name, email, and phone", () => {
    const { getByText } = render(
      <Router>
        <UserCard link="/user/1" user={mockUser} />
      </Router>
    );

    expect(getByText('Jane Doe')).toBeInTheDocument();
    expect(getByText('jane.doe@example.com')).toBeInTheDocument();
    expect(getByText('987-654-3210')).toBeInTheDocument();
  });

  it('renders the correct link', () => {
    const { container } = render(
      <Router>
        <UserCard link="/user/1" user={mockUser} />
      </Router>
    );

    const linkElement = container.querySelector('a');
    expect(linkElement).toHaveAttribute('href', '/user/1');
  });
});
