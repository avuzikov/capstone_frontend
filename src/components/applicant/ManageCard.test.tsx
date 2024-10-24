import React from 'react';
import { render, screen } from '@testing-library/react';
import ManagerCard from './ManagerCard';
import { useAuth } from '../../contexts/AuthContext';
import useFetch from '../../hooks/useFetch';

// Mock the useAuth hook
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the useFetch hook
jest.mock('../../hooks/useFetch', () => jest.fn());

describe('ManagerCard', () => {
  const mockToken = 'mock-token';
  const mockFetchDispatch = jest.fn();

  beforeEach(() => 
  {
    (useAuth as jest.Mock).mockReturnValue({ token: mockToken });
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: null,
      fetchDispatch: mockFetchDispatch,
    });
  });

  it('renders error message when there is an error', () => {
    const mockError = { message: 'Failed to fetch job data!' };
    (useFetch as jest.Mock).mockReturnValue({
      data: null,
      isPending: false,
      error: mockError,
      fetchDispatch: mockFetchDispatch,
    });

    render(<ManagerCard id="1" />);
    expect(screen.getByText(mockError.message)).toBeInTheDocument();
  });

  it('renders manager details when data is fetched successfully', () => {
    const mockData = {
      name: 'John Doe',
      department: 'Engineering',
      publicContactInfo: 'john.doe@example.com',
    };
    (useFetch as jest.Mock).mockReturnValue({
      data: mockData,
      isPending: false,
      error: null,
      fetchDispatch: mockFetchDispatch,
    });

    render(<ManagerCard id="1" />);
    expect(screen.getByText('Hiring Manager Details')).toBeInTheDocument();
    expect(screen.getByText(mockData.name)).toBeInTheDocument();
    expect(screen.getByText(mockData.department)).toBeInTheDocument();
  });
});
