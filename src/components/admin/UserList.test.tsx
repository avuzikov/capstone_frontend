// src\components\admin\UserList.test.tsx

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserList from './UserList';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('./UserCard.tsx', () => ({ user, link }: { user: any; link: any }) => (
  <div data-testid="user-card">
    <div>{user.fullName}</div>
    <div>{link}</div>
  </div>
));

describe('UserList Component', () => {
  const mockUseAuth = {
    token: 'mock-token',
  };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders loading state initially', () => {
    render(<UserList />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('renders error state when fetch fails', async () => {
    global.fetch = jest.fn().mockResolvedValueOnce({
      ok: false,
    });

    render(<UserList />);

    await waitFor(() =>
      expect(screen.getByText('Error: Failed to fetch users')).toBeInTheDocument()
    );
  });

  test.skip('renders user cards when fetch succeeds', async () => {
    const mockUsers = [
      { id: 1, fullName: 'John Doe', role: 'applicant' },
      { id: 2, fullName: 'Jane Smith', role: 'applicant' },
    ];

    window.fetch = jest.fn().mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(mockUsers),
    });

    render(<UserList />);

    screen.debug();
  });
});
