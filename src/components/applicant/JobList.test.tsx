import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useNavigate } from 'react-router-dom';
import JobList from './JobList';
import { Job } from '@/types/types';

// Mock useNavigate from react-router-dom
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('JobList', () => {
  const jobs = [
    {
      id: 1,
      userId: 1,
      listingTitle: 'Software Engineer',
      department: 'Engineering',
      listingStatus: 'open',
      dateListed: '2023-10-01',
      jobTitle: 'Frontend Developer',
      jobDescription: 'Develop and maintain web applications.',
      experienceLevel: 'Mid-level',
      additionalInformation: 'Remote position',
    },
    {
      id: 2,
      userId: 2,
      listingTitle: 'Product Manager',
      department: 'Product',
      listingStatus: 'closed',
      dateListed: '2023-09-15',
      jobTitle: 'Product Manager',
      jobDescription: 'Manage product lifecycle.',
      experienceLevel: 'Senior',
      additionalInformation: 'On-site position',
    },
  ];

  //TODO: Jobs import broken need to fix
  // it('renders job list correctly', () => {
  //   const jobs: Job[] = [
  //     {
  //       id: 1,
  //       userId: 1,
  //       listingTitle: 'Software Engineer',
  //       department: 'Engineering',
  //       listingStatus: 'open',
  //       dateListed: '2023-10-01',
  //       jobTitle: 'Frontend Developer',
  //       jobDescription: 'Develop and maintain web applications.',
  //       experienceLevel: 'Mid-level',
  //       additionalInformation: 'Remote position',
  //     },
  //     {
  //       id: 2,
  //       userId: 2,
  //       listingTitle: 'Product Manager',
  //       department: 'Product',
  //       listingStatus: 'closed',
  //       dateListed: '2023-09-15',
  //       jobTitle: 'Product Manager',
  //       jobDescription: 'Manage product lifecycle.',
  //       experienceLevel: 'Senior',
  //       additionalInformation: 'On-site position',
  //     },
  //   ];

  //   render(<JobList jobs={jobs.map(job => ({ ...job, id: job.id.toString() }))} token={null} userId={null} />);
  //   expect(screen.getByText('Department: Engineering')).toBeInTheDocument();
  //   const postedDates = screen.getAllByText(/Posted date: \d{2}\/\d{2}\/\d{4}/);
  //   expect(postedDates).toHaveLength(2);
  //   expect(postedDates[0]).toHaveTextContent('Posted date: 01/10/2023');
  //   expect(postedDates[1]).toHaveTextContent('Posted date: 15/09/2023');

  //   expect(screen.getByText('Product Manager')).toBeInTheDocument();
  //   expect(screen.getByText('Department: Product')).toBeInTheDocument();
  //   expect(screen.getByText('Recrutation closed')).toBeInTheDocument();
  // });

  it('renders "No jobs found" when job list is empty', () => {
    render(<JobList jobs={[]} token={null} userId={null} />);

    expect(screen.getByText('No jobs found')).toBeInTheDocument();
  });

  // it('navigates to job details page on job click', () => {
  //   const navigate = jest.fn();
  //   (useNavigate as jest.Mock).mockReturnValue(navigate);

  //   const jobs: Job[] = [
  //     {
  //       id: 1,
  //       userId: 1,
  //       listingTitle: 'Software Engineer',
  //       department: 'Engineering',
  //       listingStatus: 'open',
  //       dateListed: '2023-10-01',
  //       jobTitle: 'Frontend Developer',
  //       jobDescription: 'Develop and maintain web applications.',
  //       experienceLevel: 'Mid-level',
  //       additionalInformation: 'Remote position',
  //     },
  //     {
  //       id: 2,
  //       userId: 2,
  //       listingTitle: 'Product Manager',
  //       department: 'Product',
  //       listingStatus: 'closed',
  //       dateListed: '2023-09-15',
  //       jobTitle: 'Product Manager',
  //       jobDescription: 'Manage product lifecycle.',
  //       experienceLevel: 'Senior',
  //       additionalInformation: 'On-site position',
  //     },
  //   ];

  //   interface JobListProps {
  //     jobs: import("c:/Users/akharel/OneDrive - Automatic Data Processing Inc/Documents/Graduate Programme Material/WA3537 Group Capstone Full Stack Project for ADP/capstone_frontend/src/types/types").Job[];
  //     token: string | null;
  //     userId: string | null;
  //   }

  //   render(<JobList jobs={jobs} token={null} userId={null} />);

  //   fireEvent.click(screen.getByText('Software Engineer'));

  //   expect(navigate).toHaveBeenCalledWith('/jobs/1');
  // });
});
