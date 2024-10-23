// src\components\applicant\ApplicationList.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';

interface Application {
  id: number;
  userId: number;
  jobId: number;
  dateApplied: string;
  applicationStatus: string;
  coverLetter: string;
  customResume: string;
  jobTitle?: string;
}

interface ApplicationListProps {
  applications: Application[];
}

const ApplicationList: React.FC<ApplicationListProps> = ({ applications }) => {
  const navigate = useNavigate();

  if (applications.length === 0) {
    return <p>No applications found.</p>;
  }

  const handleClick = (id: number) => {
    navigate(`/applications/${id}`);
  };

  return (
    <ul className="list-none flex flex-col gap-3">
      {applications.map(application => (
        <li
          key={application.id}
          className="card-bordered hover:cursor-pointer"
          onClick={() => handleClick(application.id)}
        >
          <h3 className="text-medium font-bold mb-2">{application.jobTitle}</h3>
          <div className="text-small flex gap-2 items-center">
            <p>Date Applied: {new Date(application.dateApplied).toLocaleDateString()}</p>
            <div className="w-1 h-1 rounded-full bg-adp-navy"></div>
            <p>Status: {application.applicationStatus}</p>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ApplicationList;
