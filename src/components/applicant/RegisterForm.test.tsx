import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterForm from './RegisterForm';
import { useAuth } from '../../contexts/AuthContext';
import useFetch from '../../hooks/useFetch';
import { BrowserRouter as Router } from 'react-router-dom';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the useFetch hook
jest.mock('../../hooks/useFetch', () => jest.fn());

describe('RegisterForm', () => {
  const mockSetAuth = jest.fn();
  const mockFetchDispatch = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({ setData: mockSetAuth });
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      fetchDispatch: mockFetchDispatch,
    });
  });

  it('renders the form fields correctly', () => {
    render(
      <Router>
        <RegisterForm />
      </Router>
    );

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('example@example.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm password')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(
      <Router>
        <RegisterForm />
      </Router>
    );

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText('Field cannot be empty')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    render(
      <Router>
        <RegisterForm />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('example@example.com'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText('Enter valid email address')).toBeInTheDocument();
    });
  });

  it('shows validation error for mismatched passwords', async () => {
    render(
      <Router>
        <RegisterForm />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'password456' },
    });
    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText('Password must match')).toBeInTheDocument();
    });
  });

  it('submits the form successfully', async () => {
    (useFetch as jest.Mock).mockReturnValue({
      data: { token: 'mock-token', role: 'user', id: '1' },
      isPending: false,
      error: null,
      fetchDispatch: mockFetchDispatch,
    });

    render(
      <Router>
        <RegisterForm />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('example@example.com'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith('mock-token', 'user', '1');
    });
  });

  it('shows error message on form submission failure', async () => {
    const mockError = { message: 'Registration failed!' };
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: mockError,
      fetchDispatch: mockFetchDispatch,
    });

    render(
      <Router>
        <RegisterForm />
      </Router>
    );

    fireEvent.change(screen.getByPlaceholderText('First Name'), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByPlaceholderText('Last Name'), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByPlaceholderText('example@example.com'), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByPlaceholderText('Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByPlaceholderText('Confirm password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Register'));

    await waitFor(() => {
      expect(screen.getByText(mockError.message)).toBeInTheDocument();
    });
  });
});