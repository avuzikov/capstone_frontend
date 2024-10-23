// src\components\admin\UserCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { User } from '../../types/types';

interface UserCardProps {
  link: string;
  user: User;
}

const UserCard = ({ link, user }: UserCardProps) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex items-center justify-between h-18">
        <div className="flex flex-col">
          <h1 className="text-medium">{user.fullName}</h1>
          <div className="flex gap-2 items-center text-small">
            <p className="text-gray-500">{user.email}</p>
            {user.phone && (
              <>
                <div className="w-1 h-1 rounded-full bg-adp-navy"></div>
                <p className="text-gray-500">{user.phone}</p>
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

export default UserCard;
