import React from 'react';

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
}

const JobList: React.FC<JobListProps> = ({ jobs }) => {
  if (jobs.length === 0) {
    return <p>No jobs found</p>;
  }

  const hangleApply = (id) =>{
    console.log(id)
  }

  return (
    <ul className="list-none">
      {jobs.map((job) => (
        <li key={job.id} className="border-b py-2">
          <h3 className="text-lg font-bold text-large">{job.listingTitle}</h3>
            <p>Department: {job.department}</p>
            <p>Title: {job.jobTitle}</p>
            <p>Experience: {job.experienceLevel}</p>
            <p>Posted date: {new Date(job.dateListed).toLocaleDateString()}</p>
            <p>Description: {job.jobDescription}</p>
            <p>Additional information: {job.additionalInformation}</p>
            <button className="btn-destructive mt-small" onClick={() => hangleApply(job.id)}>Apply</button>
        </li>
      ))}
    </ul>
  );
};

export default JobList;