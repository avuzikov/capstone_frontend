// src/components/manager/ApplicantList.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantStatusUpdate from './ApplicantStatusUpdate';
import { jobService } from '../../services/jobService';
import { ApiError } from '../../services/apiClient';
import { Application } from '../../services/types';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ApplicantListProps {
  jobId: number;
}

interface EnrichedApplication extends Application {
  applicantName?: string;
}

const ApplicantList: React.FC<ApplicantListProps> = ({ jobId }) => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<EnrichedApplication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await jobService.getJobApplications(jobId.toString(), {
        page: currentPage,
        items: itemsPerPage,
      });

      setApplications(response.applications);
      setTotalPages(Math.ceil(response.total / itemsPerPage));
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('An error occurred while fetching applications');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [jobId, currentPage]);

  const handleStatusChange = async (
    applicantId: number,
    newStatus: Application['applicationStatus']
  ) => {
    try {
      await jobService.updateApplicationStatus(applicantId.toString(), newStatus);

      // Update local state
      setApplications(prev =>
        prev.map(app => (app.id === applicantId ? { ...app, applicationStatus: newStatus } : app))
      );
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update application status');
      }
    }
  };

  const handleJobStatusUpdate = () => {
    navigate(`/manager/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
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

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Applied
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map(application => (
            <tr key={application.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {application.applicantName || 'Unknown Applicant'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(application.dateApplied).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                    ${
                      application.applicationStatus === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : application.applicationStatus === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : application.applicationStatus === 'reviewed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }
                  `}
                >
                  {application.applicationStatus}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ApplicantStatusUpdate
                  applicationId={application.id}
                  jobId={jobId}
                  currentStatus={application.applicationStatus}
                  onStatusChange={newStatus => handleStatusChange(application.id, newStatus)}
                  onJobStatusUpdate={handleJobStatusUpdate}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {applications.length === 0 && (
        <div className="text-center py-4 text-gray-500">No applications found for this job.</div>
      )}

      {applications.length > 0 && (
        <div className="mt-4 flex justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 text-white bg-navy-600 rounded-l hover:bg-navy-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 text-white bg-navy-600 rounded-r hover:bg-navy-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicantList;
