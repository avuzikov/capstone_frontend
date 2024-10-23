// src/components/applicant/ApplicationDetails.test.tsx

import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ApplicationDetails from './ApplicationDetails';
import { Application, Job } from '../../services/types';
import { format } from '../../utils/formatDate';
import * as AuthContext from '../../contexts/AuthContext';
import { jobService } from '../../services/jobService';

// Mock the services
jest.mock('../../services/jobService');
jest.mock('../../contexts/AuthContext');

const APPLICATION_DETAILS: Application = {
  id: 1,
  userId: 1,
  jobId: 1,
  dateApplied: new Date('2023-05-05').toISOString(),
  applicationStatus: 'pending',
  coverLetter: 'I am excited to apply for this position...',
  customResume: 'John Doe\nSoftware Engineer\n5 years of experience in web development...',
};

const JOB_DATA: Job = {
  id: 1,
  userId: 1,
  listingTitle: 'Test job',
  department: 'test',
  listingStatus: 'open',
  dateListed: new Date('2023-05-05').toISOString(),
  jobTitle: 'Test job',
  jobDescription: 'Test job',
  experienceLevel: 'Test',
  additionalInformation: 'Test',
};

describe('Application Details', () => {
  const authContext = {
    id: '1',
    token: '1234',
    role: 'applicant',
    login: jest.fn(),
    logout: jest.fn(),
    setData: jest.fn(),
  };
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the job service methods
    (jobService.getJobById as jest.Mock).mockResolvedValue(JOB_DATA);
    (jobService.updateApplication as jest.Mock).mockResolvedValue(APPLICATION_DETAILS);

    jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => authContext);

    jest.mock('react-router-dom', () => ({
      ...(jest.requireActual('react-router-dom') as any),
      useNavigate: () => mockNavigate,
    }));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('Should contain application details - date, status, cover letter and resume', () => {
    // Given
    const appliedAt = 'Applied at: ';
    const status = 'Status: ';
    const coverLetterLabel = 'Cover Letter';
    const resumeLabel = 'Resume';
    const updateButtonLabel = 'Update';

    render(<ApplicationDetails application={APPLICATION_DETAILS} />, {
      wrapper: BrowserRouter,
    });

    // When
    const appliedAtElement = screen.getByText(appliedAt + format(APPLICATION_DETAILS.dateApplied));
    const statusElement = screen.getByText(status + APPLICATION_DETAILS.applicationStatus);
    const coverLetterElement = screen.getByLabelText(coverLetterLabel);
    const resumeElement = screen.getByLabelText(resumeLabel);
    const updateButton = screen.getByText(updateButtonLabel);

    // Then
    expect(appliedAtElement).toBeInTheDocument();
    expect(statusElement).toBeInTheDocument();
    expect(coverLetterElement).toBeInTheDocument();
    expect(resumeElement).toBeInTheDocument();
    expect(updateButton).toBeInTheDocument();
  });

  it('Should be able to update CoverLetter and Resume', () => {
    // Given
    const coverLetterLabel = 'Cover Letter';
    const resumeLabel = 'Resume';

    render(<ApplicationDetails application={APPLICATION_DETAILS} />, {
      wrapper: BrowserRouter,
    });

    const coverLetterElement = screen.getByLabelText(coverLetterLabel);
    const resumeElement = screen.getByLabelText(resumeLabel);

    // When
    fireEvent.change(coverLetterElement, { target: { value: 'Cover letter update test' } });
    fireEvent.change(resumeElement, { target: { value: 'Resume update test' } });

    const updatedCoverLetter = screen.getByText('Cover letter update test', { exact: false });
    const updatedResume = screen.getByText('Resume update test', { exact: false });

    // Then
    expect(updatedCoverLetter).toBeInTheDocument();
    expect(updatedResume).toBeInTheDocument();
  });

  it('Should be able to update Application', () => {
    // Given
    const buttonLabel = 'Update';
    render(<ApplicationDetails application={APPLICATION_DETAILS} />, {
      wrapper: BrowserRouter,
    });
    const buttonElement = screen.getByText(buttonLabel);

    // When
    fireEvent.click(buttonElement);

    // Then
    expect(jobService.updateApplication).toHaveBeenCalledWith(
      APPLICATION_DETAILS.id.toString(),
      expect.objectContaining({
        coverLetter: APPLICATION_DETAILS.coverLetter,
        customResume: APPLICATION_DETAILS.customResume,
      })
    );
    expect(mockNavigate).toHaveBeenCalledWith('/applications');
  });
});
