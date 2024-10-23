import React from 'react';
import { render, screen } from '@testing-library/react';
import JobDetails from './JobDetails';
import { JobDetailsType } from '../../types/Job';
import { format } from '../../utils/formatDate';

// Mock the format function
jest.mock('../../utils/formatDate', () => ({
  format: jest.fn(),
}));

describe('JobDetails', () => {
  const job: JobDetailsType = {
    listingTitle: 'Software Engineer',
    dateListed: '2023-10-01',
    listingStatus: 'open',
    jobTitle: 'Frontend Developer',
    department: 'Engineering',
    experienceLevel: 'Mid-level',
    jobDescription: 'Develop and maintain web applications.',
    additionalInformation: 'Remote position',
    id: 0,
    userId: 0,
  };

  beforeEach(() => {
    (format as jest.Mock).mockImplementation(date => `Formatted ${date}`);
  });

  it('renders job details correctly', () => {
    render(<JobDetails job={job} />);

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Formatted 2023-10-01')).toBeInTheDocument();
    expect(screen.getByText('Job Title:')).toBeInTheDocument();
    expect(screen.getByText('Frontend Developer')).toBeInTheDocument();
    expect(screen.getByText('Department:')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByText('Experience level:')).toBeInTheDocument();
    expect(screen.getByText('Mid-level')).toBeInTheDocument();
    expect(screen.getByText('Description:')).toBeInTheDocument();
    expect(screen.getByText('Develop and maintain web applications.')).toBeInTheDocument();
    expect(screen.getByText('Additional Information:')).toBeInTheDocument();
    expect(screen.getByText('Remote position')).toBeInTheDocument();
  });

  it('renders closed status correctly', () => {
    const closedJob: JobDetailsType = { ...job, listingStatus: 'closed' };
    render(<JobDetails job={closedJob} />);

    expect(screen.getByText('Closed: Formatted 2023-10-01')).toBeInTheDocument();
  });
});
