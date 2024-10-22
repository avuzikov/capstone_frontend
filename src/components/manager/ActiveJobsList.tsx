import React, { useState, useEffect } from 'react';
import { Job } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

interface ActiveJobsListProps {
  handleShouldUpdateJobs: () => void;
}

interface PaginatedJobResponse {
  content: Job[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
}

const ActiveJobsList: React.FC<ActiveJobsListProps> = ({ handleShouldUpdateJobs }) => {
  const { token } = useAuth();
  const [currentJobs, setCurrentJobs] = useState<Job[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const jobsPerPage = 5;

  const fetchJobs = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using the manager-specific endpoint from the README
      const response = await fetch(`/api/job/manager?page=${currentPage}&items=${jobsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setCurrentJobs(data.jobs);
      setTotalPages(Math.ceil(data.total / jobsPerPage));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching jobs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentPage, handleShouldUpdateJobs]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Active Job Listings</h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-4">Loading...</div>
      ) : (
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
            {currentJobs.map(job => (
              <tr key={job.id}>
                <td className="px-6 py-4 whitespace-nowrap">{job.listingTitle}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">{job.listingStatus}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(job.dateListed).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a href={`/manager/${job.id}`} className="text-indigo-600 hover:text-indigo-900">
                    Manage
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1 || isLoading}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages || isLoading}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveJobsList;
