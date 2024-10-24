// src\components\admin\JobCard.tsx

import React, { useState, useCallback, useEffect } from 'react';
import { Job, User } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import { Link } from 'react-router-dom';

const JobCard = ({ job }: { job: Job }) => {
  const { token } = useAuth();
  const currentManagerId = job.userId.toString();
  const [selectedManagerId, setSelectedManagerId] = useState<string>('');
  const [managers, setManagers] = useState<User[]>([]);

  const fetchManagers = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8180/users/admin/1', {
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

      managers.sort((a, b) => a.name.localeCompare(b.name));

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
      const response = await fetch('http://localhost:8000/api/job/transfer', {
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
      <Link to={`/jobs/${job.id}`}>
        <div className="flex justify-between  items-center">
          <h2 className="text-medium">{job.jobTitle}</h2>
        </div>
        <p className="text-small mb-2">Department: {job.department}</p>
        <p className="text-small">{job.jobDescription}</p>
      </Link>
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-2 items-center">
          {/* <select
            className="input-filled"
            value={selectedManagerId}
            onChange={e => handleChange(e)}
          >
            {managers.map(manager => (
              <option className="text-small" key={manager.id} value={manager.id}>
                {manager.name}
              </option>
            ))}
          </select> */}
        </div>
      </div>
    </div>
  );
};

export default JobCard;
