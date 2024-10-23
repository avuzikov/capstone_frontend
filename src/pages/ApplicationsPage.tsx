// src/pages/ApplicationsPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApplicationList from '../components/applicant/ApplicationList';
import { jobService } from '../services/jobService';
import { ApiError } from '../services/apiClient';
import { Application, Job } from '../services/types';

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const { token, id } = useAuth();
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [noMoreApplications, setNoMoreApplications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);

      try {
        // Get all applications for the user
        const response = await jobService.getApplications(`page=${page}&items=${itemsPerPage}`);
        // Filter applications for the current user
        const userApplications = response.filter(
          application => application.userId === parseInt(id, 10)
        );

        // Enrich applications with job titles
        const enrichedApplications = await Promise.all(
          userApplications.map(async application => {
            try {
              const jobDetails = await jobService.getJobById(application.jobId.toString());
              return {
                ...application,
                jobTitle: jobDetails.jobTitle,
              };
            } catch (error) {
              console.error(`Error fetching job details for job ID ${application.jobId}:`, error);
              return {
                ...application,
                jobTitle: 'Unknown Job Title',
              };
            }
          })
        );

        setApplications(enrichedApplications);
        setNoMoreApplications(enrichedApplications.length < itemsPerPage);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to load applications. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [page, itemsPerPage, token, id]);

  return (
    <div>
      <div className="container mx-auto p-4">
        {error && (
          <div className="input-error mt-1 flex gap-2 items-center text-small mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003ZM12 8.25a.75.75 0 0 1 .75.75v3.75a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 .75-.75Zm0 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                clipRule="evenodd"
              />
            </svg>
            <p className="txt-danger txt-small">{error}</p>
          </div>
        )}

        {loading ? (
          <h1>Loading applications...</h1>
        ) : (
          <ApplicationList applications={applications} />
        )}

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
              noMoreApplications ? 'btn-disabled cursor-not-allowed' : ''
            }`}
            onClick={() => setPage(prev => prev + 1)}
            disabled={noMoreApplications}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationsPage;
