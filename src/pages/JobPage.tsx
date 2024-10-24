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
  const [page, setPage] = useState(0);
  const itemsPerPage = 6;
  const [searchQuery, setSearchQuery] = useState('');
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      setLoading(true);
      try {
        const data = await fetchJobs(page, itemsPerPage, searchQuery, token);
        setJobs(data.content);
        setFirst(data.first);
        setLast(data.last);
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
          <JobSearchForm setSearchQuery={setSearchQuery} setPage={setPage} />
        </div>
        {loading ? <p>Loading jobs...</p> : <JobList jobs={jobs} token={token} userId={id} />}

        <div className="flex justify-between mt-4 items-center">
          <button
            className={`btn-primary text-normal ${first ? 'btn-disabled cursor-not-allowed' : ''}`}
            disabled={first}
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          >
            Previous
          </button>
          <span className="text-small">Page {page + 1}</span>
          <button
            className={`btn-primary text-normal ${last ? 'btn-disabled cursor-not-allowed' : ''}`}
            onClick={() => setPage(prev => prev + 1)}
            disabled={last}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobPage;
