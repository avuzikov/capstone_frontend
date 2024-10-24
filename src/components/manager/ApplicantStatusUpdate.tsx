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

  const updateJobStatus = async (status: ApplicationStatus) => {
    try {
      // If the application is accepted, update the job status to closed
      if (status === 'accepted') {
        const response = await fetch(`http://localhost:8000/api/job/${jobId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            listingStatus: 'closed',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update job status');
        }

        // Call the callback to update parent component
        onJobStatusUpdate();
      }
    } catch (error) {
      console.error('Failed to update job status:', error);
      throw error;
    }
  };

  const handleStatusChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value as ApplicationStatus;
    setIsUpdating(true);
    setError(null);

    try {
      // First, update the application status
      const applicationResponse = await fetch(
        `http://localhost:8000/api/application/manager/${applicationId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            applicationStatus: newStatus,
          }),
        }
      );

      if (!applicationResponse.ok) {
        throw new Error('Failed to update application status');
      }

      const updatedApplication = await applicationResponse.json();

      // If the application is accepted, update the job status
      if (newStatus === 'accepted') {
        await updateJobStatus(newStatus);
      }

      // Call the callback to update parent component
      onStatusChange(updatedApplication.applicationStatus as ApplicationStatus);

      // Navigate back to dashboard if status was successfully updated to accepted
      if (newStatus === 'accepted') {
        navigate('/manager/console');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      // Reset the select element to the current status if there was an error
      const selectElement = document.getElementById(`status-${applicationId}`) as HTMLSelectElement;
      if (selectElement) {
        selectElement.value = currentStatus;
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusClassName = (status: ApplicationStatus) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'reviewed':
        return 'text-blue-600';
      case 'accepted':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="inline-flex flex-col">
      <select
        id={`status-${applicationId}`}
        value={currentStatus}
        onChange={handleStatusChange}
        disabled={isUpdating}
        className={`
          btn-primary
          ${error ? 'border-red-500' : ''}
          ${getStatusClassName(currentStatus)}
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
