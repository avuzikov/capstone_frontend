// src\pages\JobPage.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import JobList from '../components/applicant/JobList';
import { fetchJobs } from '../contexts/JobApi';
import { useAuth } from '../contexts/AuthContext';
import JobSearchForm from '../components/applicant/JobSearchForm';

const JobPage: React.FC = () => {
  const { token } = useAuth();
  const { id } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [noMoreJobs, setNoMoreJobs] = useState(false);

  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(event.currentTarget.value));
  };

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await fetchJobs(page, itemsPerPage, searchQuery, token);
        setJobs(data.jobs);
        const nJobs = data.jobs.length;
        if (nJobs < itemsPerPage) {
          setNoMoreJobs(true);
        } else {
          setNoMoreJobs(false);
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadJobs();
  }, [page, itemsPerPage, searchQuery, token]);

  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="relative mb-4">
          <div className="absolute left-1/2 transfrom -translate-x-1/2">
            <JobSearchForm setSearchQuery={setSearchQuery} />
          </div>
          <div className="flex justify-end h-16">
            <select
              onChange={handleItemsPerPageChange}
              className="block mt-6 border text-small p-0 rounded-md border-adp-navy-light"
            >
              <option value={1}>1</option>
              <option value={3} selected={true}>
                3
              </option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
        {loading ? <p>Loading jobs...</p> : <JobList jobs={jobs} token={token} userId={id} />}

        <div className="flex justify-between mt-4 items-center">
          <button
            className="btn-primary text-normal"
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="text-small">Page {page}</span>
          <button
            className={`btn-primary text-normal ${
              noMoreJobs ? 'btn-disabled cursor-not-allowed' : ''
            }`}
            onClick={() => setPage(prev => prev + 1)}
            disabled={noMoreJobs}
          >
            {' '}
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
