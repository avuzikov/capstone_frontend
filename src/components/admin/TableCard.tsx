// src\components\admin\TableCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface ApplicantCardProps {
  link: string;
  name: string;
}

const TableCard = ({ link, name }: ApplicantCardProps) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex items-center justify-between h-18">
        <div className="flex flex-col">
          <h1 className="text-medium">{name}</h1>
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

export default TableCard;
