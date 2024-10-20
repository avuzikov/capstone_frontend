import React from 'react';

type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted' | 'all';

interface ApplicantSortOptionsProps {
  sortBy: 'date' | 'status';
  filterStatus: ApplicationStatus;
  onSortChange: (sortBy: 'date' | 'status') => void;
  onFilterChange: (filterStatus: ApplicationStatus) => void;
}

const ApplicantSortOptions: React.FC<ApplicantSortOptionsProps> = ({
  sortBy,
  filterStatus,
  onSortChange,
  onFilterChange,
}) => {
  return (
    <div className="mb-4 flex justify-between">
      <select
        value={sortBy}
        onChange={e => onSortChange(e.target.value as 'date' | 'status')}
        className="border border-gray-300 rounded-md shadow-sm p-2"
      >
        <option value="date">Sort by Date</option>
        <option value="status">Sort by Status</option>
      </select>
      <select
        value={filterStatus}
        onChange={e => onFilterChange(e.target.value as ApplicationStatus)}
        className="border border-gray-300 rounded-md shadow-sm p-2"
      >
        <option value="all">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="reviewed">Reviewed</option>
        <option value="accepted">Accepted</option>
        <option value="rejected">Rejected</option>
      </select>
    </div>
  );
};

export default ApplicantSortOptions;
