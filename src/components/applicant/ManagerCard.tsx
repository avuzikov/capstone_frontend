// src/components/applicant/ManagerCard.tsx
import React, { useEffect, useState } from 'react';
import { userService } from '../../services/userService';
import { ApiError } from '../../services/apiClient';
import { User } from '../../services/types';
import LoadingSpinner from '../shared/LoadingSpinner';

interface ManagerPublicInfo {
  id: number;
  fullName: string;
  department?: string;
  publicContactInfo?: string;
}

const ManagerCard = ({ id }: { id: string | undefined }) => {
  const [managerData, setManagerData] = useState<ManagerPublicInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagerData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await userService.getManagerPublicInfo(id);
        setManagerData(response);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError('Failed to fetch manager information');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchManagerData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="card-bordered">
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-bordered">
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
          <p className="txt-danger txt-small">{error}</p>
        </div>
      </div>
    );
  }

  if (!managerData) {
    return null;
  }

  return (
    <div className="card-bordered">
      <h3 className="text-start text-adp-navy-dark text-medium mt-4 ml-2">
        Hiring Manager Details
      </h3>
      <div className="flex justify-between m-2 items-center">
        <div className="flex-col text-start">
          <p className="text-adp-navy-dark text-small">{managerData.fullName}</p>
          {managerData.department && (
            <p className="text-sm text-adp-navy-light">{managerData.department}</p>
          )}
        </div>
        {managerData.publicContactInfo && (
          <p className="text-adp-navy-dark text-small">{managerData.publicContactInfo}</p>
        )}
      </div>
    </div>
  );
};

export default ManagerCard;
