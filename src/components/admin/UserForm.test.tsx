import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import UserForm from './UserForm';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
  useParams: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('UserForm Component', () => {
  const mockNavigate = jest.fn();
  const mockUseAuth = {
    token: 'mock-token',
  };

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useParams as jest.Mock).mockReturnValue({ id: '1' });
    (useAuth as jest.Mock).mockReturnValue(mockUseAuth);
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders the form with initial values', () => {
    render(<UserForm isEditing={false} />);

    expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
  });

  test('handles form submission for creating a user', async () => {
    render(<UserForm isEditing={false} />);

    fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'john@example.com' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  test('handles form validation errors', async () => {
    render(<UserForm isEditing={false} />);

    fireEvent.click(screen.getByText('Save'));

    expect(screen.getByText('Full name is required')).toBeInTheDocument();
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });

  test('handles form submission for updating a user', async () => {
    const mockFetch = jest
      .fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () =>
          Promise.resolve({
            id: 1,
            fullName: 'John Doe',
            email: 'john@example.com',
            address: '123 Main St',
            phone: '123-456-7890',
            resume: 'Experienced developer',
          }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({}),
      });
    global.fetch = mockFetch;

    render(<UserForm isEditing={true} userId="1" />);

    fireEvent.change(screen.getByPlaceholderText('Enter full name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter email'), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter address'), {
      target: { value: '123 Main St' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter phone number'), {
      target: { value: '123-456-7890' },
    });
    fireEvent.change(screen.getByPlaceholderText('Enter resume'), {
      target: { value: 'Experienced developer' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          method: 'PUT',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            Authorization: expect.any(String),
          }),
          body: JSON.stringify({
            id: 0,
            fullName: 'John Doe',
            password: '',
            email: 'john@example.com',
            address: '123 Main St',
            phone: '123-456-7890',
            resume: 'Experienced developer',
            role: 'applicant',
          }),
        })
      );
    });

    // Verify that the form fields are updated with the new values
    expect(screen.getByPlaceholderText('Enter full name')).toHaveValue('John Doe');
    expect(screen.getByPlaceholderText('Enter email')).toHaveValue('john@example.com');
    expect(screen.getByPlaceholderText('Enter address')).toHaveValue('123 Main St');
    expect(screen.getByPlaceholderText('Enter phone number')).toHaveValue('123-456-7890');
    expect(screen.getByPlaceholderText('Enter resume')).toHaveValue('Experienced developer');
  });
});
