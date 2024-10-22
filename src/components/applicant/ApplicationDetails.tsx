// src/components/applicant/ApplicationDetails.tsx
import React, { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { format } from '../../utils/formatDate';
import Input from '../shared/Input';
import LoadingSpinner from '../shared/LoadingSpinner';
import { jobService } from '../../services/jobService';
import { ApiError } from '../../services/apiClient';
import { Job, Application } from '../../services/types';

interface ApplicationDetailsProps {
  application: Application;
}

const ApplicationDetails: React.FC<ApplicationDetailsProps> = ({ application }) => {
  const navigate = useNavigate();
  const [coverLetter, setCoverLetter] = useState(application.coverLetter);
  const [resume, setResume] = useState(application.customResume);
  const [jobData, setJobData] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const jobDetails = await jobService.getJobById(application.jobId.toString());
        setJobData(jobDetails);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch job details');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetails();
  }, [application.jobId]);

  const handleCoverLetterChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCoverLetter(event.currentTarget.value);
  };

  const handleResumeChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setResume(event.currentTarget.value);
  };

  const handleUpdate = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await jobService.updateApplication(application.id.toString(), {
        ...application,
        coverLetter,
        customResume: resume,
      });
      navigate('/applications');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update application');
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="input-error mt-1 flex gap-2 items-center text-small">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="size-5"
        >
          <path
            fillRule="evenodd"
            d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
            clipRule="evenodd"
          />
        </svg>
        <p className="txt-danger txt-small">{error}</p>
      </div>
    );
  }

  if (!jobData) {
    return null;
  }

  return (
    <>
      <header className="my-5">
        <h2 className="text-medium font-extrabold ml-5 mb-2 text-stone-950">
          {jobData.listingTitle}
        </h2>
        <div className="flex items-center gap-2 mx-5">
          <p className="font-light text-small text-adp-navy-light">
            Applied at: {format(application.dateApplied)}
          </p>
          <div className="w-1 h-1 rounded-full bg-adp-navy"></div>
          <p className="font-light text-small mr-10 text-adp-navy-light">
            Status:{' '}
            {application.applicationStatus.charAt(0).toUpperCase() +
              application.applicationStatus.slice(1)}
          </p>
        </div>
      </header>
      <main className="flex-col my-3 mx-2 text-medium text-stone-950 h-full">
        <form onSubmit={handleUpdate} className="flex-col flex gap-4">
          <div className="flex flex-col text-small min-h-40">
            <Input
              name="Cover Letter"
              placeholder="Enter cover letter here"
              value={coverLetter}
              onChange={handleCoverLetterChange}
              isTextArea={true}
            />
          </div>
          <div className="flex flex-col text-small min-h-40">
            <Input
              name="Resume"
              placeholder="Enter resume here"
              value={resume}
              onChange={handleResumeChange}
              isTextArea={true}
            />
          </div>

          <button type="submit" className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Updating...' : 'Update'}
          </button>
        </form>
      </main>
    </>
  );
};

export default ApplicationDetails;
