// src\components\applicant\JobList.tsx
import React from "react";
import { useNavigate } from "react-router-dom";

interface Job {
  id: string;
  userId: string;
  listingTitle: string;
  department: string;
  listingStatus: "open" | "closed";
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
    <ul className="list-none">
      {jobs.map((job) => (
        <li
          key={job.id}
          className="card-bordered my-1 cursor-pointer"
          onClick={() => handleClick(job.id)}
        >
          <h3 className="text-lg font-bold text-large">{job.listingTitle}</h3>
          <p>Department: {job.department}</p>
          <p>Posted date: {new Date(job.dateListed).toLocaleDateString()}</p>
          {job.listingStatus === "closed" && (
            <p className="text-adp-red-light">Recrutation closed</p>
          )}
        </li>
      ))}
    </ul>
  );
};

export default JobList;
