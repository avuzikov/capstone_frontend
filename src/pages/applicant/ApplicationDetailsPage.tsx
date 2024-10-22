// src\pages\applicant\ApplicationDetailsPage.tsx

import React, { useEffect, ReactNode } from 'react';
import { useParams } from 'react-router';

import useFetch from '../../hooks/useFetch';
import { useAuth } from '../../contexts/AuthContext';
import { getApplicationDetails } from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { ApplicationDetailsType } from '../../types/Application';
import ApplicationDetails from '../../components/applicant/ApplicationDetails';

const ApplicationDetailsPage = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const { data, isPending, error, fetchDispatch } = useFetch(getApplicationDetails);

  useEffect(() => {
    fetchDispatch({ id, token });
  }, [id, token, fetchDispatch]);

  let applicationData: ReactNode;
  if (isPending) {
    applicationData = (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="large"></LoadingSpinner>
      </div>
    );
  }

  if (error) {
    applicationData = (
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

        <p className="txt-danger txt-small">
          {error?.message || 'Failed to fetch application data!'}
        </p>
      </div>
    );
  }

  if (data as ApplicationDetailsType) {
    applicationData = <ApplicationDetails application={data} />;
  }

  return (
    <main className="mx-auto w-full  lg:w-1/2 m-4 p-4 card-bordered min-h-[calc(100vh-64px-56px)]">
      {applicationData}
    </main>
  );
};

export default ApplicationDetailsPage;
