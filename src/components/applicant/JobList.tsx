// src\components\applicant\JobList.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Job {
  id: string;
  userId: string;
  listingTitle: string;
  department: string;
  listingStatus: 'open' | 'closed';
  dateListed: string;
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  additionalInformation: string;
}

interface JobListProps {
  jobs: Job[];
  token: string | null;
  userId: string | null;
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  const navigate = useNavigate();

  if (jobs.length === 0) {
    return <p>No jobs found</p>;
  }

  const handleClick = (id: string) => {
    navigate(`/jobs/${id}`);
  };

  return (
    <ul className="list-none flex flex-col gap-2">
      {jobs.map(job => (
        <li
          key={job.id}
          className="card-bordered  my-1 cursor-pointer"
          onClick={() => handleClick(job.id)}
        >
          <h3 className="t font-bold text-medium mb-1">{job.listingTitle}</h3>
          <div className="flex items-center gap-2">
            <p className="text-small">Department: {job.department}</p>
            <div className="w-1 h-1 rounded-full bg-adp-navy"></div>
            <p className="text-small">
              Posted date: {new Date(job.dateListed).toLocaleDateString()}
            </p>
          </div>
          {job.listingStatus === 'closed' && (
            <p className="text-adp-red-light">Recrutation closed</p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default JobList;
