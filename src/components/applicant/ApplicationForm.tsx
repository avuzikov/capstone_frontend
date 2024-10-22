// src/components/applicant/ApplicationForm.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { ApiError } from '../../services/apiClient';

const ApplicationForm: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [coverLetter, setCoverLetter] = useState('');
  const [customResume, setCustomResume] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const applicationData = {
        jobId: parseInt(jobId!, 10),
        coverLetter,
        customResume,
      };

      await jobService.createApplication(applicationData);
      navigate('/jobs');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to create application. Please try again later.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="m-large flex flex-col gap-2 justify-center items-center">
      <h1 className="text-medium w-full lg:w-1/2">New Application</h1>
      <form
        onSubmit={handleSubmit}
        className="p-medium card-bordered flex flex-col gap-4 w-full lg:w-1/2"
      >
        <div className="mb-medium">
          <label className="block text-small">
            Cover Letter:
            <textarea
              className="input-bordered w-full p-small mt-small"
              value={coverLetter}
              onChange={e => setCoverLetter(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>
        </div>
        <div className="mb-medium">
          <label className="block text-small">
            Custom Resume:
            <textarea
              className="input-bordered w-full p-small mt-small"
              value={customResume}
              onChange={e => setCustomResume(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </label>
        </div>
        {error && (
          <div className="input-error mt-1 flex gap-2 items-center text-small">
            <p className="txt-danger txt-small">{error}</p>
          </div>
        )}
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};

export default ApplicationForm;
