import React from 'react';
import { JobDetailsType } from '../../types/Job';
import { format } from '../../utils/formatDate';

const JobDetails = ({ job }: { job: JobDetailsType }) => {
  return (
    <div>
      <header className="my-5">
        <h2 className="text-3xl font-extrabold ml-5 mb-2 text-stone-950">{job.listingTitle}</h2>
        <div className="flex justify-between">
          <p className="font-light text-small text-adp-navy-light">{format(job.dateListed)}</p>
          {job.listingStatus === 'closed' && (
            <p className="font-light text-small text-adp-red-light">
              Closed: {format(job.dateListed)}
            </p>
          )}
        </div>
      </header>
      <hr />
      <main className="flex-col my-5 mx-2 text-medium text-stone-950 h-full">
        <div className="flex-col space-y-2">
          <div className="flex gap-2">
            <p className="font-bold">Job Title:</p>
            <p className="text-adp-navy-light">{job.jobTitle}</p>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Department:</p>
            <p className="text-adp-navy-light">{job.department}</p>
          </div>

          <div className="flex gap-2">
            <p className="font-bold">Experience level:</p>
            <p className="text-adp-navy-light">{job.experienceLevel}</p>
          </div>
        </div>

        <div className="flex-col space-y-4 my-4">
          <div className="flex-col gap-2">
            <p className="font-bold">Description:</p>
            <p className="text-adp-navy-light">{job.jobDescription}</p>
          </div>

          <div className="flex-col gap-2">
            <p className="font-bold">Additional Information:</p>
            <p className="text-adp-navy-light">{job.additionalInformation}</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobDetails;
