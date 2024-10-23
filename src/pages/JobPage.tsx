// src/pages/JobPage.tsx

import React, { useState, useEffect, ChangeEvent } from 'react';
import JobList from '../components/applicant/JobList';
import { useAuth } from '../contexts/AuthContext';
import JobSearchForm from '../components/applicant/JobSearchForm';
import { jobService } from '../services/jobService';
import { ApiError } from '../services/apiClient';
import { Job } from '../services/types';
import { PaginatedResponse } from '../services/types';
import LoadingSpinner from '../components/shared/LoadingSpinner';

const JobPage: React.FC = () => {
  const { token, id } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const [searchQuery, setSearchQuery] = useState('');
  const [noMoreJobs, setNoMoreJobs] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const handleItemsPerPageChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(parseInt(event.currentTarget.value));
    setPage(1); // Reset to first page when changing items per page
  };

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await jobService.getJobs(page, itemsPerPage);
        setJobs(response.content);
        setTotalPages(response.totalPages);
        // Check if we're on the last page by comparing current page, items per page, and total elements
        const isLastPage = page >= Math.ceil(response.totalElements / itemsPerPage);
        setNoMoreJobs(isLastPage);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load jobs. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, [page, itemsPerPage, searchQuery]);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page when searching
  };

  return (
    <div>
      <div className="container mx-auto p-6">
        <div className="relative mb-4">
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <JobSearchForm setSearchQuery={handleSearch} />
          </div>
          <div className="flex justify-end h-16">
            <select
              onChange={handleItemsPerPageChange}
              className="block mt-6 border text-small p-0 rounded-md border-adp-navy-light"
              value={itemsPerPage}
            >
              <option value={1}>1</option>
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="input-error mt-1 flex gap-2 items-center text-small">
            <p className="txt-danger txt-small">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <JobList jobs={jobs} token={token} userId={id} />
        )}

        <div className="flex justify-between mt-4 items-center">
          <button
            className="btn-primary text-normal"
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="text-small">
            Page {page} of {totalPages}
          </span>

          <button
            className={`btn-primary text-normal ${
              noMoreJobs ? 'btn-disabled cursor-not-allowed' : ''
            }`}
            onClick={() => setPage(prev => prev + 1)}
            disabled={noMoreJobs}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
