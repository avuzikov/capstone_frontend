// src/components/manager/ApplicantStatusUpdate.tsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { ApiError } from '../../services/apiClient';
import { ApplicationStatus } from '../../services/types';

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
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    setError(null);

    try {
      await jobService.updateApplicationStatus(applicationId.toString(), newStatus);
      onStatusChange(newStatus);

      // If accepting an applicant, update job status to closed
      if (newStatus === 'accepted') {
        try {
          await jobService.updateJob(jobId.toString(), {
            listingStatus: 'closed',
          });
          onJobStatusUpdate();
        } catch (err) {
          console.error('Failed to update job status:', err);
        }
      }

      // Navigate back to dashboard after successful update
      navigate('/manager/console');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update status');
      }
      // Reset the select element to the current status if there's an error
      const selectElement = document.getElementById(`status-${applicationId}`) as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = currentStatus;
      }
    } finally {
      setIsUpdating(false);
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

      {error && (
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
      )}
    </div>
  );
};

export default ApplicantStatusUpdate;
