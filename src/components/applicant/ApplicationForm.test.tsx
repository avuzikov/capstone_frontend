// src\components\applicant\ApplicationForm.test.tsx

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ApplicationForm from './ApplicationForm';
import * as AuthContext from '../../contexts/AuthContext';
import Router, { BrowserRouter } from 'react-router-dom';

jest.mock('../../contexts/AuthContext');

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');

  return {
    ...actual,
    useNavigate: jest.fn(),
    useParams: jest.fn(),
  };
});

export {};

describe('Application form', () => {
  const mockNavigate = jest.fn();
  let mockLog: jest.SpyInstance;
  const authContext = {
    id: '1',
    token: '1234',
    role: 'applicant',
    login: jest.fn(),
    logout: jest.fn(),
    setData: jest.fn(),
  };

  beforeEach(() => {
    jest.spyOn(Router, 'useParams').mockReturnValue({ jobId: '123' });
    jest.spyOn(Router, 'useNavigate').mockImplementation(() => mockNavigate);
    jest.spyOn(AuthContext, 'useAuth').mockImplementation(() => authContext);
    mockLog = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    //mockNavigate.mockClear();

    mockLog.mockRestore();
    authContext.login.mockClear();
    authContext.logout.mockClear();
    authContext.setData.mockClear();
  });

  it('Should render Cover Letter, Custom Resume and Button', () => {
    // Given
    const coverLetterLabel = 'Cover Letter:';
    const resumeLabel = 'Custom Resume:';
    const buttonLabel = 'Submit Application';

    render(<ApplicationForm />, { wrapper: BrowserRouter });

    // When
    const coverLetterElement = screen.getByLabelText(coverLetterLabel);
    const resumeElement = screen.getByLabelText(resumeLabel);
    const buttonElement = screen.getByText(buttonLabel);

    // Then
    expect(coverLetterElement).toBeInTheDocument();
    expect(resumeElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it('Should be able to type data into Cover Letter and Resume', () => {
    // Given
    const coverLetterText = 'Cover letter update test';
    const resumeText = 'Resume update test';
    const coverLetterLabel = 'Cover Letter:';
    const resumeLabel = 'Custom Resume:';

    render(<ApplicationForm />, { wrapper: BrowserRouter });

    const coverLetterElement = screen.getByLabelText(coverLetterLabel);
    const resumeElement = screen.getByLabelText(resumeLabel);

    // When
    fireEvent.change(coverLetterElement, { target: { value: coverLetterText } });
    fireEvent.change(resumeElement, { target: { value: resumeText } });
    const updatedCoverLetter = screen.getByText(coverLetterText, { exact: false });
    const updatedResume = screen.getByText(resumeText, { exact: false });

    // Then
    expect(updatedCoverLetter).toBeInTheDocument();
    expect(updatedResume).toBeInTheDocument();
  });

  it('Should create application', async () => {
    // Given
    const coverLetterText = 'Cover letter update test';
    const resumeText = 'Resume update test';
    const coverLetterLabel = 'Cover Letter:';
    const resumeLabel = 'Custom Resume:';
    const buttonLabel = 'Submit Application';

    render(<ApplicationForm />, { wrapper: BrowserRouter });

    const buttonElement = screen.getByText(buttonLabel);
    const coverLetterElement = screen.getByLabelText(coverLetterLabel);
    const resumeElement = screen.getByLabelText(resumeLabel);
    fireEvent.change(coverLetterElement, { target: { value: coverLetterText } });
    fireEvent.change(resumeElement, { target: { value: resumeText } });

    const mockFetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: jest.fn().mockResolvedValue('Test application') });
    window.fetch = mockFetch;

    // When
    fireEvent.click(buttonElement);

    // Then
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch.mock.calls[0][0]).toEqual('/api/application');
    expect(mockFetch.mock.calls[0][1]).toEqual(
      expect.objectContaining({
        body: JSON.stringify({
          jobId: 123,
          coverLetter: coverLetterText,
          customResume: resumeText,
        }),
      })
    );
    await waitFor(() => expect(mockLog).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockLog.mock.calls[0][1]).toEqual('Test application'));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/jobs'));
  });
});
