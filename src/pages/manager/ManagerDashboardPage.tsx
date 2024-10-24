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
  const { token, id } = useAuth();
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<ManagerStats | null>(null);
  const [shouldRefresh, setShouldRefresh] = useState<boolean>(false);

  const fetchManagerStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/stats/manager', {
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

    if (token && !showJobForm) {
      fetchData();
    }
  }, [token, shouldRefresh, showJobForm]);

  const handleCreateJob = async (jobData: Partial<Job>) => {

    // add id to jobData
    jobData.userId = parseInt(id ?? '');


    try {
      const response = await fetch('http://localhost:8000/api/job', {
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

      console.log(jobData);

      const newJob = await response.json();
      setShowJobForm(false);
      setShouldRefresh(prev => !prev);
      return newJob;
    } catch (error) {
      throw new Error('Failed to create job');
    }
  };

  const StatCard: React.FC<{
    title: string;
    items: { label: string; value: number; color: string }[];
  }> = ({ title, items }) => (
    <div className="card-bordered">
      <h3 className="text-lg font-semibold p-2">{title}</h3>
      <div className="space-y-2 p-2">
        {items.map(item => (
          <p key={item.label} className={item.color}>
            {item.label}: {item.value}
          </p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {/* Header with Create Button */}
      <div className="mb-8 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative card-bordered">
          <div className="flex justify-between items-center">
            <h1 className="text-large font-bold text-gray-900">Manager Dashboard</h1>
            <div className="relative z-10">
              <button onClick={() => setShowJobForm(!showJobForm)} className="btn-primary">
                {showJobForm ? 'Cancel' : 'Create New Job'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {showJobForm ? (
          <div>
            <h2 className="text-medium p-medium font-semibold">Create New Job</h2>
            <div className="card-bordered">
              <JobForm onSubmit={handleCreateJob} onCancel={() => setShowJobForm(false)} />
            </div>
          </div>
        ) : (
          <>
            {!isLoading && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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
                    {
                      label: 'Pending',
                      value: stats.pendingApplications,
                      color: 'text-yellow-600',
                    },
                    {
                      label: 'Reviewed',
                      value: stats.reviewedApplications,
                      color: 'text-blue-600',
                    },
                  ]}
                />

                <StatCard
                  title="Decisions"
                  items={[
                    {
                      label: 'Accepted',
                      value: stats.acceptedApplications,
                      color: 'text-green-600',
                    },
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

            <div className="bg-white rounded-lg shadow-lg">
              <ActiveJobsList handleShouldUpdateJobs={() => setShouldRefresh(prev => !prev)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerDashboardPage;
