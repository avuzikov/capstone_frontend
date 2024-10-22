// src/pages/manager/ManagerDashboardPage.tsx
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

    if (token) {
      fetchData();
    }
  }, [token, shouldRefresh]);

  const handleShouldFetchJobs = () => {
    setShouldRefresh(prev => !prev);
  };

  const handleCreateJob = async (jobData: Partial<Job>) => {
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

    const newJob = await response.json();
    setShowJobForm(false);
    setShouldRefresh(prev => !prev); // This will trigger a refresh of the job list
    return newJob;
  };
  const StatCard: React.FC<{
    title: string;
    items: { label: string; value: number; color: string }[];
  }> = ({ title, items }) => (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <div className="space-y-2">
        {items.map(item => (
          <p key={item.label} className={item.color}>
            {item.label}: {item.value}
          </p>
        ))}
      </div>
    </div>
  );

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

      {!isLoading && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Jobs Overview"
            items={[
              { label: 'Total Jobs', value: stats.totalJobs, color: 'text-gray-600' },
              { label: 'Open Jobs', value: stats.openJobs, color: 'text-green-600' },
              { label: 'Closed Jobs', value: stats.closedJobs, color: 'text-gray-600' },
            ]}
          />

          <StatCard
            title="Applications"
            items={[
              { label: 'Total', value: stats.totalApplications, color: 'text-gray-600' },
              { label: 'Pending', value: stats.pendingApplications, color: 'text-yellow-600' },
              { label: 'Reviewed', value: stats.reviewedApplications, color: 'text-blue-600' },
            ]}
          />

          <StatCard
            title="Decisions"
            items={[
              { label: 'Accepted', value: stats.acceptedApplications, color: 'text-green-600' },
              { label: 'Rejected', value: stats.rejectedApplications, color: 'text-red-600' },
            ]}
          />

          <StatCard
            title="Action Items"
            items={[
              {
                label: 'Pending Reviews',
                value: stats.pendingApplications,
                color: 'text-yellow-600',
              },
              { label: 'Open Positions', value: stats.openJobs, color: 'text-blue-600' },
            ]}
          />
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
        <ActiveJobsList handleShouldUpdateJobs={handleShouldFetchJobs} />
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
