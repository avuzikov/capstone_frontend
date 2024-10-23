// src\components\manager\ApplicantStatusUpdate.tsx

import React, { useState } from 'react';
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

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(`/api/application/manager/${applicationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          applicationStatus: newStatus,
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
    <div className="inline-flex flex-col">
      <select
        id={`status-${applicationId}`}
        value={currentStatus}
        onChange={e => handleStatusChange(e.target.value as ApplicationStatus)}
        disabled={isUpdating}
        className={`
          border border-gray-300 rounded-md shadow-sm p-2
          text-white bg-blue-600 hover:bg-blue-700
          focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-400 disabled:cursor-not-allowed
          transition-colors duration-200
          ${error ? 'border-red-500' : ''}
        `}
        style={{ backgroundColor: '#1a4689' }}
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
