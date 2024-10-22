import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManagerList from './ManagerList';
import { useAuth } from '../../contexts/AuthContext';
import { User } from '../../mocks/types';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the ManagerCard component
jest.mock('./ManagerCard.tsx', () => {
  return ({ manager, link }: { manager: User; link: string }) => (
    <div data-testid="manager-card">
      <a href={link}>{manager.fullName}</a>
    </div>
  );
});

describe('ManagerList Component', () => {
  const mockToken = 'mock-token';
  const mockManagers: User[] = [
    { id: 1, fullName: 'Manager One', email: 'email@email.com', password: 'password', role: 'hiring-manager' },
    { id: 2, fullName: 'Manager Twi', email: 'email2@email.com', password: 'password2', role: 'hiring-manager' },
  ];

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ token: mockToken });
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('displays loading state initially', () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockManagers,
    });

    render(<ManagerList />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays error state on fetch failure', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    render(<ManagerList />);

    await waitFor(() => expect(screen.getByText('Error: Failed to fetch users')).toBeInTheDocument());
  });

  test('displays manager cards on successful fetch', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockManagers,
    });

    render(<ManagerList />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
      expect(screen.getAllByTestId('manager-card')).toHaveLength(mockManagers.length);
      mockManagers.forEach((manager) => {
        expect(screen.getByText(manager.fullName)).toBeInTheDocument();
      });
    });
  });
});