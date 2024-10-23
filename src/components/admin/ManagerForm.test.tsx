// src\components\admin\ManagerForm.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ManagerForm from './ManagerForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ManagerForm Component', () => {
  const mockNavigate = jest.fn();
  const mockUseParams = { id: '1' };
  const mockUseAuth = { token: 'test-token', user: { role: 'admin' } };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue(mockUseParams);
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders form fields correctly', () => {
    render(<ManagerForm isEditing={false} />);

    expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  test('validates form and shows errors', async () => {
    render(<ManagerForm isEditing={false} />);

    fireEvent.change(screen.getByPlaceholderText('Enter full name'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), { target: { value: '' } });
    fireEvent.change(screen.getByPlaceholderText('Enter email'), { target: { value: '' } });

    fireEvent.submit(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  test('submits form successfully', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(<ManagerForm isEditing={false} />);

    fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'john.doe@example.com' },
    });

    fireEvent.submit(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });
});
