// src\components\applicant\ApplicationForm.tsx

import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../shared/Input';

interface ApplicationRequest {
  candidateId: number;
  candidateEmail: string | null;
  jobId: number;
  coverLetter: string;
  customResume: string;
  applicationStatus: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  yearsOfExperience: number | null;
}

const ApplicationForm: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { token, id } = useAuth();
  const [email, setEmail] = useState('');
  const [yearsOfExperience, setYearsOfExperience] = useState('0');
  const [coverLetter, setCoverLetter] = useState('');
  const [customResume, setCustomResume] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const applicationData: ApplicationRequest = {
      candidateId: parseInt(id!, 10),
      candidateEmail: email,
      jobId: parseInt(jobId!, 10),
      coverLetter,
      customResume,
      applicationStatus: 'pending',
      yearsOfExperience: parseInt(yearsOfExperience, 10),
    };

    try {
      const response = await fetch('http://localhost:8000/api/application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create application');
      }

      const newApplication = await response.json();
      console.log('Application created successfully:', newApplication);

      navigate('/jobs');
    } catch (error) {
      console.error('Error creating application:', error);
    }
  };

  return (
    <div className="m-large flex flex-col gap-2 justify-center items-center">
      <h1 className="text-medium w-full lg:w-1/2">New Application</h1>
      <form
        onSubmit={handleSubmit}
        className="p-medium card-bordered  flex flex-col gap-4 w-full lg:w-1/2"
      >
        <div className="mb-medium ">
          <div className="flex gap-4 justify-items-stretch mb-4">
            <div className="flex-grow">
              <Input
                name="Email"
                placeholder="Email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="flex-grow">
              <Input
                name="Years of experience"
                placeholder="Years of experience"
                type="number"
                value={yearsOfExperience}
                onChange={e => setYearsOfExperience(e.target.value)}
              />
            </div>
          </div>
          <label className="block text-small">
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
          <label className="block text-small">
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
    </div>
  );
};

export default ApplicationForm;
