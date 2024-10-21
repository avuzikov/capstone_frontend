// src\components\applicant\ApplicationForm.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api/apiClient';

interface ApplicationRequest {
  jobId: number;
  coverLetter: string;
  customResume: string;
}

const ApplicationForm: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { token } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [customResume, setCustomResume] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const applicationData: ApplicationRequest = {
      jobId: parseInt(jobId!, 10),
      coverLetter,
      customResume,
    };

    console.log(applicationData);

    try {
      if (!token) {
        throw new Error('No authentication token available');
      }
      const newApplication = await apiClient.createApplication(applicationData, token);
      console.log('Application created successfully:', newApplication);
      navigate('/jobs');
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-medium">
      <div className="mb-medium">
        <label className="block text-medium">
          Cover Letter:
          <textarea
            className="input-bordered w-full p-small mt-small"
            value={coverLetter}
            onChange={e => setCoverLetter(e.target.value)}
            required
          />
        </label>
      </div>
      <div className="mb-medium">
        <label className="block text-medium">
          Custom Resume:
          <textarea
            className="input-bordered w-full p-small mt-small"
            value={customResume}
            onChange={e => setCustomResume(e.target.value)}
            required
          />
        </label>
      </div>
      <button type="submit" className="btn-primary">
        Submit Application
      </button>
    </form>
  );
};

export default ApplicationForm;
