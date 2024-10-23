import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import JobForm from './JobForm';
import { Job } from '../../types/types';

describe('JobForm', () => {
  const mockOnSubmit = jest.fn().mockResolvedValue(undefined);
  const mockOnCancel = jest.fn();

  const initialJob: Partial<Job> = {
    department: 'Engineering',
    listingTitle: 'Software Engineer',
    jobTitle: 'Frontend Developer',
    jobDescription: 'Develop and maintain web applications.',
    listingStatus: 'open',
    experienceLevel: 'Mid-level',
    additionalInformation: 'Remote position',
  };

  it('submits the form with correct data', async () => {
    const { getByLabelText, getByRole } = render(
      <JobForm initialJob={initialJob} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    fireEvent.change(getByLabelText(/Listing Title/i), { target: { value: 'Backend Developer' } });
    fireEvent.change(getByLabelText(/Department/i), { target: { value: 'IT' } });
    fireEvent.change(getByLabelText(/Job Title/i), { target: { value: 'Backend Developer' } });
    fireEvent.change(getByLabelText(/Experience Level/i), { target: { value: 'Senior' } });
    fireEvent.change(getByLabelText(/Job Description/i), {
      target: { value: 'Develop backend services.' },
    });
    fireEvent.change(getByLabelText(/Additional Information/i), {
      target: { value: 'On-site position' },
    });

    fireEvent.click(getByRole('button', { name: /Create Job/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        department: 'IT',
        listingTitle: 'Backend Developer',
        jobTitle: 'Backend Developer',
        jobDescription: 'Develop backend services.',
        listingStatus: 'open',
        experienceLevel: 'Senior',
        additionalInformation: 'On-site position',
        dateListed: expect.any(String),
      });
    });
  });

  it('displays loading state during form submission', async () => {
    const { getByRole } = render(
      <JobForm initialJob={initialJob} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    fireEvent.click(getByRole('button', { name: /Create Job/i }));

    await waitFor(() => {
      expect(getByRole('button', { name: /Submitting.../i })).toBeInTheDocument();
    });
  });

  it('displays error message on submission failure', async () => {
    mockOnSubmit.mockRejectedValueOnce(new Error('Failed to submit job posting'));

    const { getByRole, getByText } = render(
      <JobForm initialJob={initialJob} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    fireEvent.click(getByRole('button', { name: /Create Job/i }));

    await waitFor(() => {
      expect(getByText(/Failed to submit job posting/i)).toBeInTheDocument();
    });
  });

  it('calls onCancel when cancel button is clicked', () => {
    const { getByRole } = render(
      <JobForm initialJob={initialJob} onSubmit={mockOnSubmit} onCancel={mockOnCancel} />
    );

    fireEvent.click(getByRole('button', { name: /Cancel/i }));

    expect(mockOnCancel).toHaveBeenCalled();
  });
});
