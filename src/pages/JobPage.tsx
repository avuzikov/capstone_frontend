// src/pages/JobPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import JobList from '../components/applicant/JobList';
import { useAuth } from '../contexts/AuthContext';
import { fetchJobs } from '../utils/apiUtils';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import { debounce } from '../utils/generalUtils';

const JobPage: React.FC = () => {
  const { token } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      setSearchQuery(query);
      setPage(1); // Reset to first page on new search
    }, 300),
    []
  );

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const allJobs = await fetchJobs(token);
        const filteredJobs = allJobs
          .filter(job => job.listingTitle.toLowerCase().includes(searchQuery.toLowerCase()))
          .slice((page - 1) * itemsPerPage, page * itemsPerPage);
        setJobs(filteredJobs);
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
      <div className="container mx-auto p-4">
        <input
          type="text"
          placeholder="Search jobs..."
          onChange={e => debouncedSearch(e.target.value)}
          className="input-bordered w-full mb-4"
        />

        {loading ? <LoadingSpinner /> : <JobList jobs={jobs} token={token} userId={null} />}

        <div className="flex justify-between items-center p-medium">
          <button
            className="btn-primary m-small text-normal"
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="text-medium">Page {page}</span>
          <button
            className="btn-primary m-small text-normal"
            onClick={() => setPage(prev => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
