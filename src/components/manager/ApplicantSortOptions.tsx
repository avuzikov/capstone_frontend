// src\components\manager\ApplicantSortOptions.tsx

import React from 'react';
import { Application } from '../../types/types';

type ApplicationStatus = Application['applicationStatus'];
type SortOption = 'date' | 'status';

interface ApplicantSortOptionsProps {
  sortBy: SortOption;
  filterStatus: ApplicationStatus | 'all';
  onSortChange: (sortBy: SortOption) => void;
  onFilterChange: (status: ApplicationStatus | 'all') => void;
  isLoading?: boolean;
  totalApplications?: number;
}

const ApplicantSortOptions: React.FC<ApplicantSortOptionsProps> = ({
  sortBy,
  filterStatus,
  onSortChange,
  onFilterChange,
  isLoading = false,
  totalApplications = 0,
}) => {
  // Get counts from parent component or API call
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSortChange(e.target.value as SortOption);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange(e.target.value as ApplicationStatus | 'all');
  };

  return (
    <div className="mb-6 space-y-4">
      {/* Summary Stats */}
      <div className="text-sm text-gray-600">Total Applications: {totalApplications}</div>

      <div className="flex flex-wrap gap-4">
        {/* Sort Options */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={handleSortChange}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 
                     focus:ring-blue-500 focus:border-blue-500 
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="date">Application Date</option>
            <option value="status">Application Status</option>
          </select>
        </div>

        {/* Filter Options */}
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="filterStatus" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Status
          </label>
          <select
            id="filterStatus"
            value={filterStatus}
            onChange={handleFilterChange}
            disabled={isLoading}
            className="w-full border border-gray-300 rounded-md shadow-sm p-2 
                     focus:ring-blue-500 focus:border-blue-500 
                     disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="all">All Applications</option>
            <option value="pending">Pending Review</option>
            <option value="reviewed">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Loading Indicator */}
      {isLoading && <div className="text-sm text-gray-500">Updating results...</div>}
    </div>
  );
};

export default ApplicantSortOptions;
