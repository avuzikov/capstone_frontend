import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApplicantStatusUpdate from './ApplicantStatusUpdate';

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('ApplicantStatusUpdate', () => {
  const mockNavigate = jest.fn();
  const mockOnStatusChange = jest.fn();
  const mockOnJobStatusUpdate = jest.fn();
  const mockToken = 'mock-token';

  beforeEach(() => {
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useAuth as jest.Mock).mockReturnValue({ token: mockToken });
  });

  const defaultProps = {
    applicationId: 1,
    currentStatus: 'pending' as 'pending' | 'reviewed' | 'rejected' | 'accepted',
    jobId: 1,
    onStatusChange: mockOnStatusChange,
    onJobStatusUpdate: mockOnJobStatusUpdate,
  };

  it('renders correctly with default props', () => {
    const { getByDisplayValue } = render(<ApplicantStatusUpdate {...defaultProps} />);

    expect(getByDisplayValue(/Pending/i)).toBeInTheDocument();
  });

  it('calls onStatusChange and navigates on successful status change', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ applicationStatus: 'reviewed' }),
    });

    const { getByDisplayValue } = render(<ApplicantStatusUpdate {...defaultProps} />);

    fireEvent.change(getByDisplayValue(/Pending/i), { target: { value: 'reviewed' } });

    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith('reviewed');
      expect(mockNavigate).toHaveBeenCalledWith('/manager/console');
    });
  });

  //   it('displays error message on failed status change', async () => {
  //     global.fetch = jest.fn().mockResolvedValue({
  //       ok: false,
  //     });

  //     const { getByDisplayValue, getByText } = render(<ApplicantStatusUpdate {...defaultProps} />);

  //     fireEvent.change(getByDisplayValue(/Pending/i), { target: { value: 'reviewed' } });

  //     await waitFor(() => {
  //       expect(getByText(/Failed to update status/i)).toBeInTheDocument();
  //     });
  //   });

  it('displays loading indicator while updating', async () => {
    global.fetch = jest.fn().mockImplementation(
      () =>
        new Promise(resolve =>
          setTimeout(
            () =>
              resolve({
                ok: true,
                json: jest.fn().mockResolvedValue({ applicationStatus: 'reviewed' }),
              }),
            100
          )
        )
    );

    const { getByDisplayValue, getByText } = render(<ApplicantStatusUpdate {...defaultProps} />);

    fireEvent.change(getByDisplayValue(/Pending/i), { target: { value: 'reviewed' } });

    expect(getByText(/Updating.../i)).toBeInTheDocument();

    await waitFor(() => {
      expect(mockOnStatusChange).toHaveBeenCalledWith('reviewed');
    });
  });
});
