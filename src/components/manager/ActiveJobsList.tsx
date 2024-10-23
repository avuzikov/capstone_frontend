// src/components/manager/ActiveJobsList.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Job } from '../../types/types';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ActiveJobsListProps {
  handleShouldUpdateJobs: () => void;
}

const ActiveJobsList: React.FC<ActiveJobsListProps> = ({ handleShouldUpdateJobs }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  const fetchJobs = useCallback(async () => {
    if (!token) return;

    try {
      const response = await fetch('/api/job/manager', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch jobs');
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = jobs.slice(indexOfFirstJob, indexOfLastJob);

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
                {currentJobs.map(job => (
                  <tr key={job.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{job.listingTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{job.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{job.listingStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(job.dateListed).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleManageJob(job.id)}
                        className="text-blue-600 hover:text-blue-900"
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
      <div className="mt-4 flex justify-between">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md ${
            currentPage === 1 ? 'bg-gray-500 cursor-not-allowed' : ''
          }`}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentPage(prev => Math.min(prev + 1, Math.ceil(jobs.length / jobsPerPage)))
          }
          disabled={currentPage === Math.ceil(jobs.length / jobsPerPage)}
          className={`bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-md ${
            currentPage === Math.ceil(jobs.length / jobsPerPage)
              ? 'bg-gray-500 cursor-not-allowed'
              : ''
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveJobsList;
