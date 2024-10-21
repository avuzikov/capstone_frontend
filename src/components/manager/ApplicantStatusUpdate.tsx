import React from 'react';

type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted';

interface ApplicantStatusUpdateProps {
  currentStatus: ApplicationStatus;
  onStatusChange: (newStatus: ApplicationStatus) => void;
}

const ApplicantStatusUpdate: React.FC<ApplicantStatusUpdateProps> = ({ currentStatus, onStatusChange }) => {
  return (
    <select
      value={currentStatus}
      onChange={(e) => onStatusChange(e.target.value as ApplicationStatus)}
      className="border border-gray-300 rounded-md shadow-sm p-2"
    >
      <option value="pending">Pending</option>
      <option value="reviewed">Reviewed</option>
      <option value="accepted">Accepted</option>
      <option value="rejected">Rejected</option>
    </select>
  );
};

export default ApplicantStatusUpdate;