import React, { useState } from 'react';
import { Application } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted';

interface ApplicantStatusUpdateProps {
  applicationId: number;
  currentStatus: ApplicationStatus;
  onStatusChange: (newStatus: ApplicationStatus) => void;
}

const ApplicantStatusUpdate: React.FC<ApplicantStatusUpdateProps> = ({
  applicationId,
  currentStatus,
  onStatusChange,
}) => {
  const { token } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    setIsUpdating(true);
    setError(null);

    try {
      // Using the manager endpoint for updating application status from README
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      // Revert select value to current status on error
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
          focus:ring-blue-500 focus:border-blue-500
          disabled:bg-gray-100 disabled:cursor-not-allowed
          ${error ? 'border-red-500' : ''}
        `}
      >
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>

      {isUpdating && <span className="text-sm text-gray-500 mt-1">Updating...</span>}

      {error && <span className="text-sm text-red-500 mt-1">{error}</span>}
    </div>
  );
};

export default ApplicantStatusUpdate;
