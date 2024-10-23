// src/components/manager/ActiveJobsList.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobService } from '../../services/jobService';
import { ApiError } from '../../services/apiClient';
import { Job } from '../../services/types';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ActiveJobsListProps {
  handleShouldUpdateJobs: () => void;
}

interface EnrichedJob extends Job {
  applicantCount?: number;
}

const ActiveJobsList: React.FC<ActiveJobsListProps> = ({ handleShouldUpdateJobs }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<EnrichedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 5; // Define the constant here

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await jobService.getManagerJobs({
          page: currentPage,
          items: jobsPerPage,
        });

        setJobs(response.content);
        setTotalPages(response.totalPages);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch jobs. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [currentPage, handleShouldUpdateJobs]);

  const handleManageJob = (jobId: number) => {
    navigate(`/manager/${jobId}`);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
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
      </div>
    );
  }

  return (
    <div className="card-bordered">
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 ml-3">Active Job Listings</h2>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600 p-4">No jobs found</p>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Department
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Listed
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map(job => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{job.listingTitle}</div>
                      {job.applicantCount !== undefined && (
                        <div className="text-xs text-gray-500">
                          {job.applicantCount} applicant{job.applicantCount !== 1 ? 's' : ''}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {job.department}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.listingStatus === 'open'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {job.listingStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(job.dateListed).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleManageJob(job.id)}
                        className="text-blue-600 hover:text-blue-900 font-medium"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
      <div className="mt-4 flex justify-between p-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveJobsList;
