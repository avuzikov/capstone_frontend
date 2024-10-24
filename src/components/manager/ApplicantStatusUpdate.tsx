// src\components\manager\ApplicantStatusUpdate.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Application } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted';

interface ApplicantStatusUpdateProps {
  applicationId: number;
  currentStatus: ApplicationStatus;
  jobId: number;
  onStatusChange: (newStatus: ApplicationStatus) => void;
  onJobStatusUpdate: () => void;
}

const ApplicantStatusUpdate: React.FC<ApplicantStatusUpdateProps> = ({
  applicationId,
  currentStatus,
  jobId,
  onStatusChange,
  onJobStatusUpdate,
}) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [application, setApplication] = useState<Application | null>(null);

  const fetchApplication = async () => {
    const response = await fetch(`http://localhost:8000/api/application/${applicationId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch application');
    }

    const data: Application = await response.json();

    setApplication(data);
  };

  useEffect(() => {
    fetchApplication();
  }, []);


  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:8000/api/application/manager/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          candidateId: application?.candidateId,
          candidateEmail: application?.candidateEmail,
          jobId: jobId,
          coverLetter: application?.coverLetter,
          customResume: application?.customResume,
          applicationStatus: newStatus,
          yearsOfExperience: application?.yearsOfExperience,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      const updatedApplication: Application = await response.json();
      onStatusChange(updatedApplication.applicationStatus as ApplicationStatus);

      // Handle job status update if needed
      if (newStatus === 'accepted') {
        await updateJobStatus(jobId, newStatus);
      }

      // Navigate back to dashboard after successful update
      navigate('/manager/console');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      const selectElement = document.getElementById(`status-${applicationId}`) as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = currentStatus;
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const updateJobStatus = async (jobId: number, applicationStatus: ApplicationStatus) => {
    if (applicationStatus === 'accepted') {
      try {
        await fetch(`/api/job/${jobId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listingStatus: 'closed',
          }),
        });
      } catch (error) {
        console.error('Failed to update job status:', error);
      }
    }
  };

  return (
    <div className="inline-flex flex-col ">
      <select
        id={`status-${applicationId}`}
        value={currentStatus}
        onChange={e => handleStatusChange(e.target.value as ApplicationStatus)}
        disabled={isUpdating}
        className={`
          btn-primary
          ${error ? 'border-red-500' : ''}
        `}
      >
        <option value="pending" className="bg-white text-gray-900">
          Pending
        </option>
        <option value="reviewed" className="bg-white text-gray-900">
          Reviewed
        </option>
        <option value="accepted" className="bg-white text-gray-900">
          Accepted
        </option>
        <option value="rejected" className="bg-white text-gray-900">
          Rejected
        </option>
      </select>

      {isUpdating && <span className="text-sm text-gray-500 mt-1">Updating...</span>}
      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default ApplicantStatusUpdate;
