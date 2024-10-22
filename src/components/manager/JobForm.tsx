import React, { useState } from 'react';

interface JobFormProps {
  initialJob?: {
    listingTitle: string;
    department: string;
    listingStatus: string;
    jobTitle: string;
    jobDescription: string;
    experienceLevel: string;
    additionalInformation?: string;
  };
  onSubmit: (jobData: any) => void;
  handleShouldUpdateJobs?: () => void;
}

const JobForm: React.FC<JobFormProps> = ({ initialJob, onSubmit, handleShouldUpdateJobs }) => {
  const [job, setJob] = useState(
    initialJob || {
      listingTitle: '',
      department: '',
      listingStatus: 'open',
      jobTitle: '',
      jobDescription: '',
      experienceLevel: '',
      additionalInformation: '',
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setJob(prevJob => ({ ...prevJob, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(job);
    if (handleShouldUpdateJobs) {
      handleShouldUpdateJobs();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="listingTitle" className="block text-sm font-medium text-gray-700">
          Listing Title
        </label>
        <input
          type="text"
          name="listingTitle"
          id="listingTitle"
          value={job.listingTitle}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="department" className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <input
          type="text"
          name="department"
          id="department"
          value={job.department}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="listingStatus" className="block text-sm font-medium text-gray-700">
          Listing Status
        </label>
        <select
          name="listingStatus"
          id="listingStatus"
          value={job.listingStatus}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div>
        <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          name="jobTitle"
          id="jobTitle"
          value={job.jobTitle}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">
          Job Description
        </label>
        <textarea
          name="jobDescription"
          id="jobDescription"
          value={job.jobDescription}
          onChange={handleChange}
          required
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>
      <div>
        <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700">
          Experience Level
        </label>
        <input
          type="text"
          name="experienceLevel"
          id="experienceLevel"
          value={job.experienceLevel}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="additionalInformation" className="block text-sm font-medium text-gray-700">
          Additional Information
        </label>
        <textarea
          name="additionalInformation"
          id="additionalInformation"
          value={job.additionalInformation}
          onChange={handleChange}
          rows={4}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        ></textarea>
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {initialJob ? 'Update Job' : 'Create Job'}
      </button>
    </form>
  );
};

export default JobForm;
