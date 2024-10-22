import React, { useState } from 'react';
import { Job } from '../../types/types';

interface JobFormProps {
  initialJob?: Partial<Job>;
  onSubmit: (jobData: Partial<Job>) => void;
  handleShouldUpdateJobs?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialJob, onSubmit, handleShouldUpdateJobs }) => {
  const [job, setJob] = useState<Partial<Job>>({
    listingTitle: initialJob?.listingTitle || '',
    department: initialJob?.department || '',
    listingStatus: initialJob?.listingStatus || 'open',
    jobTitle: initialJob?.jobTitle || '',
    jobDescription: initialJob?.jobDescription || '',
    experienceLevel: initialJob?.experienceLevel || '',
    additionalInformation: initialJob?.additionalInformation || '',
    dateListed: initialJob?.dateListed || new Date().toISOString(),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setJob(prevJob => ({
      ...prevJob,
      [name]: name === 'listingStatus' ? value.toLowerCase() : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(job);
    if (handleShouldUpdateJobs) {
      handleShouldUpdateJobs();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-bordered mt-2">
      <div className="p-medium md:p-large flex flex-col gap-4">
        <div>
          <label htmlFor="listingTitle" className="block text-small pl-2.5">
            Listing Title
          </label>
          <input
            type="text"
            name="listingTitle"
            id="listingTitle"
            value={job.listingTitle || ''}
            onChange={handleChange}
            required
            className="input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="department" className="block text-small pl-2.5">
            Department
          </label>
          <input
            type="text"
            name="department"
            id="department"
            value={job.department || ''}
            onChange={handleChange}
            required
            className="input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="listingStatus" className="block text-small pl-2.5">
            Listing Status
          </label>
          <select
            name="listingStatus"
            id="listingStatus"
            value={job.listingStatus || 'open'}
            onChange={handleChange}
            className="input-bordered w-full"
          >
            <option value="open">Open</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="jobTitle" className="block text-small pl-2.5">
            Job Title
          </label>
          <input
            type="text"
            name="jobTitle"
            id="jobTitle"
            value={job.jobTitle || ''}
            onChange={handleChange}
            required
            className="input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="jobDescription" className="block text-small pl-2.5">
            Job Description
          </label>
          <textarea
            name="jobDescription"
            id="jobDescription"
            value={job.jobDescription || ''}
            onChange={handleChange}
            required
            rows={4}
            className="input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="experienceLevel" className="block text-small pl-2.5">
            Experience Level
          </label>
          <input
            type="text"
            name="experienceLevel"
            id="experienceLevel"
            value={job.experienceLevel || ''}
            onChange={handleChange}
            required
            className="input-bordered w-full"
          />
        </div>

        <div>
          <label htmlFor="additionalInformation" className="block text-small pl-2.5">
            Additional Information
          </label>
          <textarea
            name="additionalInformation"
            id="additionalInformation"
            value={job.additionalInformation || ''}
            onChange={handleChange}
            rows={4}
            className="input-bordered w-full"
          />
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" className="btn-primary">
            {initialJob ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default JobForm;
