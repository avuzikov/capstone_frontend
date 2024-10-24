import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Job } from '../../types/types';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ActiveJobsListProps {
  handleShouldUpdateJobs: () => void;
}

interface JobsResponse {
  content: Job[];
  totalElements: number;
  totalPages: number;
  number: number; // current page number
  size: number; // items per page
}

const ActiveJobsList: React.FC<ActiveJobsListProps> = ({ handleShouldUpdateJobs }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0); // Start at 0 to match backend
  const [totalPages, setTotalPages] = useState(0);
  const jobsPerPage = 5;

  const fetchJobs = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch(
        `http://localhost:8000/job/page?page=${currentPage}&items=${jobsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data: JobsResponse = await response.json();
      console.log('Fetched jobs data:', data); // Add this for debugging
      setJobs(data.content || []); // Spring returns content array
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching jobs:', err); // Add this for debugging
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  }, [token, currentPage]); // Add currentPage as dependency

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, currentPage]); // Re-fetch when page changes

  useEffect(() => {
    // Add this effect to refresh jobs when handleShouldUpdateJobs is called
    fetchJobs();
  }, [handleShouldUpdateJobs, fetchJobs]);

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
    return <div className="p-4 text-red-600">{error}</div>;
  }

  return (
    <div className="card-bordered">
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 ml-3">Active Job Listings</h2>
        {jobs.length === 0 ? (
          <p className="text-center text-gray-600">No jobs found</p>
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
                    <td className="px-6 py-4 whitespace-nowrap">{job.listingTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{job.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{job.listingStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(job.dateListed).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => handleManageJob(job.id)} className="text-adp-navy">
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
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
          disabled={currentPage === 0}
          className={`btn-primary border-none text-normal ${
            currentPage === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-300 hover:bg-adp-red'
          }`}
        >
          Previous
        </button>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
          disabled={currentPage === totalPages - 1}
          className={`btn-primary border-none text-normal ${
            currentPage === totalPages - 1
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-gray-300 hover:bg-adp-red'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveJobsList;
