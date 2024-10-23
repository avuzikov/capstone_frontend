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
  const itemsPerPage = 6;
  const [searchQuery, setSearchQuery] = useState('');
  const [noMoreJobs, setNoMoreJobs] = useState(false);

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
        <div className="flex justify-center mb-4">
          <JobSearchForm setSearchQuery={setSearchQuery} />
        </div>
        {loading ? <p>Loading jobs...</p> : <JobList jobs={jobs} token={token} userId={id} />}

        <div className="flex justify-between mt-4 items-center">
          <button
            className={`btn-primary text-normal ${
              page === 1 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-300 hover:bg-adp-red'
            }`}
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="text-small">Page {page}</span>
          <button
            className={`btn-primary text-normal ${
              noMoreJobs ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-300 hover:bg-adp-red'
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
