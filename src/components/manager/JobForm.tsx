import React, { useState, useEffect } from 'react';

interface Job {
  id: number;
  listingTitle: string;
  dateListed: string;
  applicantsCount: number;
}

interface JobFormProps {
  onSubmit: (job: Job) => void;
  initialJob?: Job | null;
}

const JobForm: React.FC<JobFormProps> = ({ onSubmit, initialJob }) => {
  const [listingTitle, setListingTitle] = useState(initialJob?.listingTitle || '');
  const [dateListed, setDateListed] = useState(initialJob?.dateListed || '');

  useEffect(() => {
    if (initialJob) {
      setListingTitle(initialJob.listingTitle);
      setDateListed(initialJob.dateListed);
    }
  }, [initialJob]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      id: initialJob?.id || 0,
      listingTitle,
      dateListed,
      applicantsCount: initialJob?.applicantsCount || 0,
    });
    setListingTitle('');
    setDateListed('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">
        {initialJob ? 'Edit Job' : 'Add New Job'}
      </h2>
      <div className="mb-4">
        <label htmlFor="listingTitle" className="block text-sm font-medium text-gray-700">
          Job Title
        </label>
        <input
          type="text"
          id="listingTitle"
          value={listingTitle}
          onChange={(e) => setListingTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="dateListed" className="block text-sm font-medium text-gray-700">
          Date Listed
        </label>
        <input
          type="date"
          id="dateListed"
          value={dateListed}
          onChange={(e) => setDateListed(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        {initialJob ? 'Update Job' : 'Add Job'}
      </button>
    </form>
  );
};

export default JobForm;
