import React, { useState, useEffect } from 'react';
import { jobs } from '../../mocks/mockData.ts';


const ActiveJobsList: React.FC = () => {
  const [currentJobs, setCurrentJobs] = useState(jobs);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    const indexOfLastJob = currentPage * jobsPerPage;
    const indexOfFirstJob = indexOfLastJob - jobsPerPage;
    setCurrentJobs(jobs.slice(indexOfFirstJob, indexOfLastJob));
  }, [currentPage]);

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Active Job Listings</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Listed</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {currentJobs.map((job) => (
            <tr key={job.id}>
              <td className="px-6 py-4 whitespace-nowrap">{job.listingTitle}</td>
              <td className="px-6 py-4 whitespace-nowrap">{job.department}</td>
              <td className="px-6 py-4 whitespace-nowrap">{job.listingStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(job.dateListed).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <a href={`/manager/${job.id}`} className="text-indigo-600 hover:text-indigo-900">Manage</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 flex justify-between">
        <button 
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
        >
          Previous
        </button>
        <button 
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(jobs.length / jobsPerPage)))}
          disabled={currentPage === Math.ceil(jobs.length / jobsPerPage)}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ActiveJobsList;