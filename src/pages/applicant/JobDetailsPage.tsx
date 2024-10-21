import React from "react";
import { useParams } from "react-router-dom";
import useFetch from "../../hooks/useFetch.tsx";
import { getJobDetails } from "../../services/api.ts";

const JobDetailsPage = () => {
  const { id } = useParams();

  return (
    <div className="mx-auto w-2/3 min-h-[calc(100vh-64px-56px)] m-4 gap-2 flex flex-row">
      <div className="bg-adp-gray border-adp-navy-light border rounded-lg p-4 w-1/2">
        Test Jobs
      </div>
      <div className="card-filled w-1/2">Test</div>
    </div>
  );
};

export default JobDetailsPage;
