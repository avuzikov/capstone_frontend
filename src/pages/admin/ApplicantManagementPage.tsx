import React from "react";
import { Link } from "react-router-dom";
import ApplicantList from "../../components/admin/ApplicantList.tsx";
import BackButton from "../../components/shared/BackButton.tsx";

const ApplicantManagementPage = () => {
  return (
    <div className="flex flex-col gap-3 p-large">
      <div className="flex justify-between items-center">
        <BackButton />
        <Link to="/admin/newApplicant">
          <button className="btn-primary">New Applicant</button>
        </Link>
      </div>
      <div className="flex justify-between">
        <h1 className="text-large">Applicant Management</h1>
      </div>

      <ApplicantList />
    </div>
  );
};

export default ApplicantManagementPage;
