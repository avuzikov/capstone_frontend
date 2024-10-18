import React from "react";
import ApplicantList from "../../components/admin/ApplicantList.tsx";
import BackButton from "../../components/shared/BackButton.tsx";

const ApplicantManagementPage = () => {
  return (
    <div className="flex flex-col gap-4 p-large">
      <BackButton />
      <div className="flex justify-between">
        <h1 className="text-large">User Management</h1>
      </div>

      <ApplicantList />
    </div>
  );
};

export default ApplicantManagementPage;
