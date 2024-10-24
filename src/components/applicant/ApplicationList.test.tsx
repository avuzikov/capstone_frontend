// src\components\applicant\ApplicationList.test.tsx

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ApplicationList from './ApplicationList';
import Router, { BrowserRouter } from 'react-router-dom';

import { JobDetailsType } from '../../types/Job';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: jest.fn(),
  };
});

const JOB: JobDetailsType[] = [
  {
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
  },
  {
    listingTitle: 'Software Engineer',
    dateListed: '2023-10-01',
    listingStatus: 'open',
    jobTitle: 'Software Developer',
    department: 'Engineering',
    experienceLevel: 'Mid-level',
    jobDescription: 'Develop and maintain web applications.',
    additionalInformation: 'Remote position',
    id: 0,
    userId: 0,
  },
];

const APPLICATIONS = [
  {
    id: 1,
    userId: 1,
    job: JOB[0],
    dateApplied: new Date('2023-05-05').toISOString(),
    applicationStatus: 'pending',
    coverLetter: 'I am excited to apply for this position...',
    customResume: 'John Doe\nSoftware Engineer\n5 years of experience in web development...',
  },
  {
    id: 2,
    userId: 4,
    job: JOB[1],
    dateApplied: new Date('2023-05-20').toISOString(),
    applicationStatus: 'reviewed',
    coverLetter: 'As an experienced product manager, I am thrilled to apply for this role...',
    customResume: 'Alice Johnson\nProduct Manager\n4 years of experience in product development...',
  },
];

describe('Application List', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    //mockNavigate.mockClear();
  });

  it('Should render correct number of elements', () => {
    // Given
    render(<ApplicationList applications={APPLICATIONS} />, { wrapper: BrowserRouter });

    // When
    const applicationElements = screen.getAllByRole('listitem');

    // Then
    screen.debug();
    expect(applicationElements).toHaveLength(2);
  });

  it('Should render application correctly - Title, Date Applies, Status, Cover Letter, Resume', () => {
    // Given
    const application = APPLICATIONS[0];
    render(<ApplicationList applications={APPLICATIONS} />, { wrapper: BrowserRouter });

    // When
    const titleElement = screen.getByText(application.job.jobTitle, { exact: false });
    const date = screen.getByText(new Date(application.dateApplied).toLocaleDateString(), {
      exact: false,
    });
    const status = screen.getByText(application.applicationStatus, { exact: false });

    // Then
    expect(titleElement).toBeInTheDocument();
    expect(date).toBeInTheDocument();
    expect(status).toBeInTheDocument();
  });

  it('Should navigate to application details when clicked', async () => {
    // Given
    render(<ApplicationList applications={APPLICATIONS} />, { wrapper: BrowserRouter });
    const applicationElements = screen.getAllByRole('listitem');

    // When
    fireEvent.click(applicationElements[0]);

    // Then
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith(`/applications/${APPLICATIONS[0].id}`)
    );
  });
});

export {};
