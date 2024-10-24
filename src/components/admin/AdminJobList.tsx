// src\components\admin\AdminJobList.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Job } from '../../types/types';
import JobCard from './JobCard';

const AdminJobList = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  const { token } = useAuth();

  // fetch jobs

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/job', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }

      const data = await response.json();

      console.log(data);

      setJobs(data);
    } catch (err) {
      console.error(err);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchJobs();
    }
  }, [token, fetchJobs]);

  return (
    <div className="flex flex-col gap-3">
      {jobs.map(job => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default AdminJobList;
