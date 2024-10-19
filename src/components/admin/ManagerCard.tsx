import React from "react";
import { Link } from "react-router-dom";
import { User } from "../../mocks/types";

interface ManagerCardProps {
  link: string;
  manager: User;
}

const ManagerCard = ({ link, manager }: ManagerCardProps) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex items-center justify-between h-18">
        <div className="flex flex-col">
          <h1 className="text-medium">{manager.fullName}</h1>
          <div className="flex gap-2 items-center text-small">
            <p className="text-gray-500">{manager.email}</p>
            {manager.phone && (
              <>
                <div className="w-1 h-1 rounded-full bg-adp-navy"></div>
                <p className="text-gray-500">{manager.phone}</p>
              </>
            )}
            {manager.department && (
                <>
                    <div className="w-1 h-1 rounded-full bg-adp-navy"></div>
                    <p className="text-gray-500">{manager.department}</p>
                </>
                )       
            }

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

export default ManagerCard;
