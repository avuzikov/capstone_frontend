import React from 'react';

interface Job {
  id: number;
  listingTitle: string;
  dateListed: string;
  applicantsCount: number;
}

interface ActiveJobsListProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}

const ActiveJobsList: React.FC<ActiveJobsListProps> = ({ jobs = [], onEdit, onDelete }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Active Jobs</h2>
        <p>No active jobs found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold p-6 border-b">Active Jobs</h2>
      <ul className="divide-y divide-gray-200">
        {jobs.map((job) => (
          <li key={job.id} className="p-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{job.listingTitle}</h3>
              <p className="text-sm text-gray-500">Listed on: {job.dateListed}</p>
              <p className="text-sm text-gray-500">Applicants: {job.applicantsCount}</p>
            </div>
            <div>
              <button
                onClick={() => onEdit(job)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(job.id)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveJobsList;