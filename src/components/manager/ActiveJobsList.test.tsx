import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ActiveJobsList from './ActiveJobsList';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock useAuth
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock useNavigate
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('ActiveJobsList', () => {
  const mockUseAuth = useAuth as jest.Mock;
  const mockNavigate = useNavigate as jest.Mock;
  const mockFetch = jest.fn();

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ token: 'test-token' });
    mockNavigate.mockReturnValue(jest.fn());
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('displays error message if fetching jobs fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
    });

    render(<ActiveJobsList handleShouldUpdateJobs={jest.fn()} />);

    await waitFor(() => expect(screen.getByText(/failed to fetch jobs/i)).toBeInTheDocument());
  });

  test('displays job listings when data is fetched successfully', async () => {
    const jobs = [
      { id: 1, listingTitle: 'Job 1', department: 'Dept 1', listingStatus: 'Open', dateListed: '2023-01-01' },
      { id: 2, listingTitle: 'Job 2', department: 'Dept 2', listingStatus: 'Closed', dateListed: '2023-01-02' },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jobs }),
    });

    render(<ActiveJobsList handleShouldUpdateJobs={jest.fn()} />);

    await waitFor(() => expect(screen.getByText('Job 1')).toBeInTheDocument());
    expect(screen.getByText('Job 2')).toBeInTheDocument();
  });

  test('pagination buttons work correctly', async () => {
    const jobs = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      listingTitle: `Job ${i + 1}`,
      department: `Dept ${i + 1}`,
      listingStatus: 'Open',
      dateListed: '2023-01-01',
    }));

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ jobs }),
    });

    render(<ActiveJobsList handleShouldUpdateJobs={jest.fn()} />);

    await waitFor(() => expect(screen.getByText('Job 1')).toBeInTheDocument());

    // Click next page
    fireEvent.click(screen.getByText(/next/i));
    await waitFor(() => expect(screen.getByText('Job 6')).toBeInTheDocument());

    // Click previous page
    fireEvent.click(screen.getByText(/previous/i));
    await waitFor(() => expect(screen.getByText('Job 1')).toBeInTheDocument());
  });
});