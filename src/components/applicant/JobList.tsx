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

const JobList: React.FC<JobListProps> = ({ jobs, token, userId }) => {

    const navigate = useNavigate();

  if (jobs.length === 0) {
    return <p>No jobs found</p>;
  }

  const hangleApply = (id:string) =>{
    console.log(id)
    console.log(token)
    console.log(userId)
    navigate(`/apply/${id}`)
  }

  return (
    <ul className="list-none">
      {jobs.map((job) => (
        <li key={job.id} className="border-b py-2">
          <h3 className="text-lg font-bold text-large">{job.listingTitle}</h3>
            <p>Department: {job.department}</p>
            <p>Title: {job.jobTitle}</p>
            <p>Posted date: {new Date(job.dateListed).toLocaleDateString()}</p>
            <button className="btn-destructive mt-small" onClick={() => hangleApply(job.id)}>Apply</button>
        </li>
      ))}
    </ul>
  );
};

export default JobList;