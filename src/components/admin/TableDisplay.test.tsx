import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { BrowserRouter as Router } from 'react-router-dom';
import TableDisplay from './TableDisplay';
import { useAuth } from '../../contexts/AuthContext';
import { useParams } from 'react-router-dom';

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
  useNavigate: jest.fn(),
}));

describe('TableDisplay Component', () => {
  const mockUseAuth = { token: 'test-token' };
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    (useParams as jest.Mock).mockReturnValue({ name: 'users' });
    (jest.requireMock('react-router-dom').useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays loading state initially', () => {
    render(
      <Router>
        <TableDisplay />
      </Router>
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  test('displays table data on successful fetch', async () => {
    const mockUsers = [
      { id: '1', role: 'admin', name: 'Admin User' },
      { id: '2', role: 'applicant', name: 'Applicant User' },
      { id: '3', role: 'hiring-manager', name: 'Manager User' },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    ) as jest.Mock;

    render(
      <Router>
        <TableDisplay />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    expect(screen.getByText('Admins')).toBeInTheDocument();
    expect(screen.getByText('Applicants')).toBeInTheDocument();
    expect(screen.getByText('Hiring Managers')).toBeInTheDocument();

    mockUsers.forEach(user => {
      expect(screen.getByText(user.name)).toBeInTheDocument();
    });
  });

  test('handles navigation on row click', async () => {
    const mockUsers = [
      { id: '1', role: 'admin', name: 'Admin User' },
      { id: '2', role: 'applicant', name: 'Applicant User' },
      { id: '3', role: 'hiring-manager', name: 'Manager User' },
    ];

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockUsers),
      })
    ) as jest.Mock;

    render(
      <Router>
        <TableDisplay />
      </Router>
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });

    const applicantRow = screen.getByText('Applicant User').closest('tr');
    fireEvent.click(applicantRow!);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/user/2');
  });

  test('displays error message on fetch failure', async () => {
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Failed to fetch'))
    ) as jest.Mock;

    render(
      <Router>
        <TableDisplay />
      </Router>
    );

    expect(screen.queryByText('Admins')).not.toBeInTheDocument();
    expect(screen.queryByText('Applicants')).not.toBeInTheDocument();
    expect(screen.queryByText('Hiring Managers')).not.toBeInTheDocument();
  });
});