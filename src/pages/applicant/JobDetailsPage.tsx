// src\pages\applicant\JobDetailsPage.tsx

import React, { ReactNode, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthContext';
import useFetch from '../../hooks/useFetch';
import { getJobDetails } from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { JobDetailsType } from '../../types/Job';
import JobDetails from '../../components/applicant/JobDetails';
import ManagerCard from '../../components/applicant/ManagerCard';
import ApplyButton from '../../components/applicant/ApplyButton';

const JobDetailsPage = () => {
  const { id } = useParams();
  const { token, role } = useAuth();
  const { data, isPending, error, fetchDispatch } = useFetch(getJobDetails);

  const isAuthenticatedApplicant = token && role === 'applicant';

  useEffect(() => {
    fetchDispatch({ id, token });
  }, [id, token, fetchDispatch]);

  let jobData: ReactNode;
  if (isPending) {
    jobData = (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="large"></LoadingSpinner>
      </div>
    );
  }

  if (error) {
    jobData = (
      <div className="input-error mt-1 flex gap-2 items-center text-small">
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

        <p className="txt-danger txt-small">{error.message || 'Failed to fetch job data!'}</p>
      </div>
    );
  }

  if (data as JobDetailsType) {
    jobData = <JobDetails job={data} />;
  }

  return (
    <div className="mx-auto w-2/3 min-h-[calc(100vh-64px-56px)] m-5  gap-2 flex flex-row">
      <main className="card-bordered  w-1/2">{jobData}</main>
      <aside className="flex-col text-center w-1/2">
        <div>
          <ManagerCard id={data?.userId} />
        </div>

        {isAuthenticatedApplicant && data?.listingStatus === 'open' && (
          <ApplyButton id={data?.id} />
        )}
        {!isAuthenticatedApplicant && data?.listingStatus === 'open' && (
          <Link
            to="/login"
            className="block py-1.5 px-3 bg-adp-gray text-adp-navy-light border border-red-200 rounded-md shadow-sm hover:bg-stone-200 transition-colors w-full mt-2 text-medium"
          >
            You should be logged in as applicant!
          </Link>
        )}
      </aside>
    </div>
  );
};

export default JobDetailsPage;
