// src\components\admin\JobTransferCard.tsx

import React, { useEffect, useState, useCallback } from 'react';
import { User, Job } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api/apiClient';

interface JobTransferCardProps {
  currentManagerId: string;
  jobs: Job[];
  handleShouldFetchJobs: () => void;
}

const JobTransferCard: React.FC<JobTransferCardProps> = ({
  currentManagerId,
  jobs,
  handleShouldFetchJobs,
}) => {
  const [managers, setManagers] = useState<User[]>([]);
  const { token } = useAuth();
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');

  const fetchManagers = useCallback(async () => {
    try {
      if (!token) return;
      const data = await apiClient.fetchUsers(token);
      const managers = data.filter(user => user.role === 'hiring-manager');
      managers.sort((a, b) => a.fullName.localeCompare(b.fullName));
      setManagers(managers);

      if (managers.length > 0 && !selectedManagerId) {
        const firstAvailableManager = managers.find(
          manager => manager.id.toString() !== currentManagerId
        );
        if (firstAvailableManager) {
          setSelectedManagerId(String(firstAvailableManager.id));
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [token, selectedManagerId, currentManagerId]);

  const transferJobs = async () => {
    try {
      if (!token) return;
      for (const job of jobs) {
        await apiClient.updateJob(
          job.id.toString(),
          { userId: parseInt(selectedManagerId) },
          token
        );
        handleShouldFetchJobs();
      }
    } catch (error) {
      console.error('Failed to transfer jobs:', error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchManagers();
    }
  }, [token, fetchManagers]);

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <h1 className="text-large p-small w-full lg:w-1/2">Transfer Jobs</h1>
      <div className="card-bordered mt-1 w-full lg:w-1/2">
        <div className="flex flex-col p-medium lg:p-large">
          <p className="pl-small mb-1">Manager</p>
          <select
            name="manager"
            id="manager"
            className="input-filled w-full md:w-auto"
            value={selectedManagerId}
            onChange={e => setSelectedManagerId(e.target.value)}
          >
            {managers
              .filter(manager => manager.id.toString() !== currentManagerId)
              .map(manager => (
                <option key={manager.id} value={manager.id}>
                  {manager.fullName}
                </option>
              ))}
          </select>
          <button className="btn-primary mt-6 w-full" onClick={transferJobs}>
            Transfer Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobTransferCard;
