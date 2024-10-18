import React from "react";
import ApplicantCard from "./ApplicantCard.tsx";

const ApplicantList = () => {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(20)].map((_, i) => (
        <ApplicantCard key={i} link="/admin/applicant/1" />
      ))}
    </div>
  );
};

export default ApplicantList;
