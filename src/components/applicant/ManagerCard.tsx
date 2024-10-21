import React, { useEffect, ReactNode } from "react";
import useFetch from "../../hooks/useFetch.tsx";

import { getUserDetails } from "../../services/api.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import LoadingSpinner from "../shared/LoadingSpinner.tsx";

const ManagerCard = ({ id }: { id: string | undefined }) => {
  const { token } = useAuth();
  const { data, isPending, error, fetchDispatch } = useFetch(getUserDetails);

  useEffect(() => {
    if (id) {
      fetchDispatch({ id, token });
    }
  }, [id, fetchDispatch, token]);

  let managerData: ReactNode;
  if (isPending) {
    managerData = (
      <div className="flex justify-center items-center h-full">
        <LoadingSpinner size="large"></LoadingSpinner>
      </div>
    );
  }

  if (error) {
    managerData = (
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
          {error.message || "Failed to fetch job data!"}
        </p>
      </div>
    );
  }

  if (data) {
    managerData = (
      <>
        <h3 className="text-start text-adp-navy-dark text-large mt-6 ml-2">
          Hiring Manager Details
        </h3>
        <div className="flex justify-between m-4 items-center">
          <div className="flex-col text-start">
            <p className="text-adp-navy-dark text-medium">{data.fullName}</p>
            <p className="text-sm text-adp-navy-light">{data.department}</p>
          </div>
          <p className="text-adp-navy-dark text-medium">
            {data.publicContactInfo}
          </p>
        </div>
      </>
    );
  }

  return <div className="card-filled">{managerData}</div>;
};

export default ManagerCard;