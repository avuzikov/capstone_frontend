import React, { useState, useCallback, useEffect } from 'react';
import { Job, User } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

const JobCard = ({ job }: { job: Job }) => {
  const { token } = useAuth();
  const [currentManagerId, setCurrentManagerId] = useState<string>(job.userId.toString());
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [managers, setManagers] = useState<User[]>([]);

  const fetchManagers = useCallback(async () => {
    try {
      const response = await fetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: User[] = await response.json();

      const managers = data.filter(user => user.role === 'hiring-manager');

      managers.sort((a, b) => a.fullName.localeCompare(b.fullName));

      setManagers(managers);

      if (managers.length > 0 && !selectedManagerId) {
        setSelectedManagerId(String(managers[0].id));
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

  useEffect(() => {
    if (token) {
      fetchManagers();
    }
  }, [token, fetchManagers]);

  const transferJob = async () => {
    try {
      const response = await fetch('/api/job/transfer', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobId: job.id,
          fromUserId: currentManagerId,
          toUserId: selectedManagerId,
        }),
      });

      if (!response.ok) {
        console.error('Failed to transfer job', job.id);
      }
    } catch (error) {
      console.error('Failed to transfer jobs:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedManagerId(e.target.value);

    transferJob();
  };

  return (
    <div className="card-bordered">
      <div className="flex justify-between  items-center">
        <h2 className="text-medium">{job.jobTitle}</h2>
      </div>
      <p className="text-small mb-2">Department: {job.department}</p>
      <p className="text-small">{job.jobDescription}</p>

      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2 items-center">
          <p className="text-small">Manager:</p>
          <select
            className="input-filled"
            value={selectedManagerId}
            onChange={e => handleChange(e)}
          >
            {managers.map(manager => (
              <option className="text-small" key={manager.id} value={manager.id}>
                {manager.fullName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
