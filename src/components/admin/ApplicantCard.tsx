import { Link } from "react-router-dom";
import React from "react";

interface ApplicantCardProps {
  link: string;
}

const ApplicantCard = ({ link }: ApplicantCardProps) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex items-center justify-between h-18  ">
        <div className="flex flex-col">
          <h1 className="text-medium">{"Tom"}</h1>

          <div className="flex gap-4 items-center text-small">
            <p className="text-gray-500">Tom@example.com</p>
            <div className="w-2 h-2 rounded-full bg-adp-navy"></div>
            <p className="text-gray-500">07999205403</p>
          </div>
        </div>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={3}
          className="size-4 stroke-adp-navy"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </div>
    </Link>
  );
};

export default ApplicantCard;
