import React from "react";
import { Link } from "react-router-dom";
import { User } from "../../mocks/types";

interface ApplicantCardProps {
  link: string;
  applicant: User;
}

const ApplicantCard = ({ link, applicant }: ApplicantCardProps) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex items-center justify-between h-18">
        <div className="flex flex-col">
          <h1 className="text-medium">{applicant.fullName}</h1>
          <div className="flex gap-4 items-center text-small">
            <p className="text-gray-500">{applicant.email}</p>
            {applicant.phone && (
              <>
                <div className="w-2 h-2 rounded-full bg-adp-navy"></div>
                <p className="text-gray-500">{applicant.phone}</p>
              </>
            )}
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          stroke="currentColor"
          className="size-4"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};

export default ApplicantCard;