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
    <ul className="list-none">
      {applications.map(application => (
        <li
          key={application.id}
          className="card-bordered hover:cursor-pointer"
          onClick={() => handleClick(application.id)}
        >
          <h3 className="text-lg font-bold text-large">{application.jobTitle}</h3>
          <p>Date Applied: {new Date(application.dateApplied).toLocaleDateString()}</p>
          <p>Status: {application.applicationStatus}</p>
          <p>Cover Letter: {application.coverLetter}</p>
          <p>Custom Resume: {application.customResume}</p>
        </li>
      ))}
    </ul>
  );
};

export default ApplicationList;
