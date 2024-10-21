import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router";

import { ApplicationDetailsType } from "../../types/Application";
import { format } from "../../utils/formatDate.ts";
import Input from "../shared/Input.tsx";
import useFetch from "../../hooks/useFetch.tsx";
import { getJobDetails, updateApplication } from "../../services/api.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";
import LoadingSpinner from "../shared/LoadingSpinner.tsx";
import { error } from "console";
import { applications } from "../../mocks/mockData.ts";

const ApplicationDetails = ({
  application,
}: {
  application: ApplicationDetailsType;
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [coverLetter, setCoverLetter] = useState(application.coverLetter);
  const [resume, setResume] = useState(application.customResume);

  const {
    data: jobData,
    isPending: jobIsPending,
    error: jobError,
    fetchDispatch: jobFetchDispatch,
  } = useFetch(getJobDetails);
  const {
    data: updateData,
    isPending: updateIsPending,
    error: updateError,
    fetchDispatch: updateDispatch,
  } = useFetch(updateApplication);

  useEffect(() => {
    const jobId: Number = application.jobId;
    jobFetchDispatch({ id: jobId.toString(), token });
  }, [application, token, jobFetchDispatch]);

  useEffect(() => {
    if (updateData) {
      navigate(`/applications`);
    }
  }, [updateData]);

  const handleCoverLetterChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCoverLetter(event.currentTarget.value);
  };

  const handleResumeChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResume(event.currentTarget.value);
  };

  const handleUpdate = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const applicationId: Number = application.id;

    await updateDispatch({
      id: applicationId.toString(),
      token,
      application: {
        ...application,
        coverLetter: coverLetter,
        customResume: resume,
      },
    });
  };

  return (
    <>
      {jobIsPending && (
        <div className="flex flex-col justify-center items-center h-full">
          <LoadingSpinner size="large"></LoadingSpinner>
        </div>
      )}

      {jobError && (
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
            {jobError?.message || "Failed to fetch job data!"}
          </p>
        </div>
      )}
      {jobData && (
        <>
          <header className="my-5">
            <h2 className="text-3xl font-extrabold ml-5 mb-2 text-stone-950">
              JOB TITLE
            </h2>
            <div className="flex justify-between mx-5">
              <p className="font-light text-small text-adp-navy-light">
                Applied at: {format(application.dateApplied)}
              </p>
              <p className="font-light text-small mr-10 text-adp-navy-light">
                Status: {application.applicationStatus}
              </p>
            </div>
          </header>
          <hr />
          <main className="flex-col my-5 mx-2 text-medium text-stone-950 h-full">
            <form onSubmit={handleUpdate} className="flex-col space-y-2">
              <div className="flex flex-col min-h-40">
                <Input
                  name="Cover Letter"
                  placeholder="Enter cover letter here"
                  value={coverLetter}
                  onChange={handleCoverLetterChange}
                  isTextArea={true}
                />
              </div>
              <div className="flex flex-col min-h-40">
                <Input
                  name="Resume"
                  placeholder="Enter resume here"
                  value={resume}
                  onChange={handleResumeChange}
                  isTextArea={true}
                />
              </div>
              {updateIsPending && <LoadingSpinner size="small" />}
              {!updateIsPending && (
                <button type="submit" className="btn-destructive">
                  Update
                </button>
              )}
              {updateError && (
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
                    {updateError?.message ||
                      "Failed to fetch application data!"}
                  </p>
                </div>
              )}
            </form>
          </main>
        </>
      )}
    </>
  );
};

export default ApplicationDetails;
