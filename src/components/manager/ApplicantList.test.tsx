import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicantList from './ApplicantList';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ApplicantList', () => {
  const mockNavigate = jest.fn();
  const mockToken = 'mock-token';

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ token: mockToken });
  });

  const mockApplications = [
    {
      id: 1,
      applicantName: 'John Doe',
      dateApplied: '2023-01-01T00:00:00Z',
      applicationStatus: 'pending',
    },
    {
      id: 2,
      applicantName: 'Jane Smith',
      dateApplied: '2023-01-02T00:00:00Z',
      applicationStatus: 'reviewed',
    },
  ];

  const mockPaginatedResponse = {
    total: 2,
    page: 1,
    items: 2,
    applications: mockApplications,
  };

  it('renders correctly and fetches applications', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockPaginatedResponse),
    });

    const { getByText } = render(<ApplicantList jobId={1} />);

    await waitFor(() => {
      expect(getByText(/John Doe/i)).toBeInTheDocument();
      expect(getByText(/Jane Smith/i)).toBeInTheDocument();
    });
  });

  it('displays error message on fetch failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    });

    const { getByText } = render(<ApplicantList jobId={1} />);

    await waitFor(() => {
      expect(getByText(/Failed to fetch applications/i)).toBeInTheDocument();
    });
  });
});