// src\components\admin\JobTransferCard.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import JobTransferCard from './JobTransferCard';
import { useAuth } from '../../contexts/AuthContext';
import { Job } from '../../types/types';

//TODO: Pass test
jest.mock('../../contexts/AuthContext');

describe('JobTransferCard', () => {
  const mockToken = 'mock-token';
  const mockFetch = jest.fn();
  const mockHandleShouldFetchJobs = jest.fn();
  const mockUseAuth = useAuth as jest.Mock;

  beforeEach(() => {
    mockUseAuth.mockReturnValue({ token: mockToken });
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly', async () => {
    const mockManagers = [
      { id: 2, fullName: 'Manager One', role: 'hiring-manager' },
      { id: 3, fullName: 'Manager Two', role: 'hiring-manager' },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockManagers,
    });

    render(
      <JobTransferCard
        currentManagerId="1"
        jobs={[]}
        handleShouldFetchJobs={mockHandleShouldFetchJobs}
      />
    );
    const transferElement = await screen.findByRole('heading', { name: 'Transfer Jobs' });
    expect(transferElement).toBeInTheDocument();
  });

  test('fetches and displays managers', async () => {
    const mockManagers = [
      { id: 2, fullName: 'Manager One', role: 'hiring-manager' },
      { id: 3, fullName: 'Manager Two', role: 'hiring-manager' },
    ];

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockManagers,
    });

    render(
      <JobTransferCard
        currentManagerId="1"
        jobs={[]}
        handleShouldFetchJobs={mockHandleShouldFetchJobs}
      />
    );

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith('/users', expect.any(Object)));
    const managerOne = await screen.findByText('Manager One');
    const managerTwo = await screen.findByText('Manager One');

    expect(managerOne).toBeInTheDocument();
    expect(managerTwo).toBeInTheDocument();
  });

  test('transfers jobs', async () => {
    const mockJobs: Job[] = [
      {
        id: 1,
        userId: 1,
        department: 'department',
        listingTitle: 'listing-title',
        dateListed: 'date-listed',
        jobTitle: 'job-title',
        jobDescription: 'job-description',
        listingStatus: 'open',
        experienceLevel: 'experience-level',
      },
      {
        id: 2,
        userId: 2,
        department: 'department',
        listingTitle: 'listing-title',
        dateListed: 'date-listed',
        jobTitle: 'job-title',
        jobDescription: 'job-description',
        listingStatus: 'open',
        experienceLevel: 'experience-level',
      },
    ];

    const mockManagers = [
      { id: 2, fullName: 'Manager One', role: 'hiring-manager' },
      { id: 3, fullName: 'Manager Two', role: 'hiring-manager' },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockManagers,
    });

    render(
      <JobTransferCard
        currentManagerId="1"
        jobs={mockJobs}
        handleShouldFetchJobs={mockHandleShouldFetchJobs}
      />
    );

    await waitFor(() => expect(mockFetch).toHaveBeenCalledWith('/users', expect.any(Object)));
    const comboBox = await screen.findByRole('combobox');
    const button = await screen.findByRole('button', { name: 'Transfer Jobs' });
    fireEvent.change(comboBox, { target: { value: '2' } });
    fireEvent.click(button);

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(3)); // 1 for fetching managers, 2 for
    await waitFor(() =>
      expect(mockFetch).toHaveBeenCalledWith('/api/job/transfer', expect.any(Object))
    );
    await waitFor(() => expect(mockHandleShouldFetchJobs).toHaveBeenCalledTimes(2));
  });
});
