import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import JobForm from '../../components/manager/JobForm';
import ActiveJobsList from '../../components/manager/ActiveJobsList';
import { Job } from '../../types/types';

interface ManagerStats {
  totalJobs: number;
  openJobs: number;
  closedJobs: number;
  totalApplications: number;
  pendingApplications: number;
  reviewedApplications: number;
  acceptedApplications: number;
  rejectedApplications: number;
}

const ManagerDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  // Fetch manager statistics
  const fetchManagerStats = async () => {
    try {
      const response = await fetch('/api/stats/manager', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch manager statistics');
      }

      const data: ManagerStats = await response.json();
      setStats(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while fetching statistics');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchManagerStats();
      setIsLoading(false);
    };

    fetchData();
  }, [shouldRefresh]);

  const handleCreateJob = async (jobData: Partial<Job>) => {
    setError(null);
    try {
      const response = await fetch('/api/job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        throw new Error('Failed to create job');
      }

      const newJob: Job = await response.json();
      setShowJobForm(false);
      setShouldRefresh(prev => !prev); // Trigger refresh of job list and stats
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create job');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manager Dashboard</h1>
        <button
          onClick={() => setShowJobForm(!showJobForm)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {showJobForm ? 'Cancel' : 'Create New Job'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Statistics Dashboard */}
      {!isLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Jobs Overview</h3>
            <div className="space-y-2">
              <p className="text-gray-600">Total Jobs: {stats.totalJobs}</p>
              <p className="text-green-600">Open Jobs: {stats.openJobs}</p>
              <p className="text-gray-600">Closed Jobs: {stats.closedJobs}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Applications</h3>
            <div className="space-y-2">
              <p className="text-gray-600">Total: {stats.totalApplications}</p>
              <p className="text-yellow-600">Pending: {stats.pendingApplications}</p>
              <p className="text-blue-600">Reviewed: {stats.reviewedApplications}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Decisions</h3>
            <div className="space-y-2">
              <p className="text-green-600">Accepted: {stats.acceptedApplications}</p>
              <p className="text-red-600">Rejected: {stats.rejectedApplications}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Action Items</h3>
            <div className="space-y-2">
              <p className="text-yellow-600">Pending Reviews: {stats.pendingApplications}</p>
              <p className="text-blue-600">Open Positions: {stats.openJobs}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && <div className="text-center py-4">Loading dashboard data...</div>}

      {showJobForm && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Job</h2>
          <JobForm onSubmit={handleCreateJob} onCancel={() => setShowJobForm(false)} />
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <ActiveJobsList handleShouldUpdateJobs={() => setShouldRefresh(prev => !prev)} />
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
