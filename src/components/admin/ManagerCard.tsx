import React from "react";
import { Link } from "react-router-dom";

interface ManagerCardProps {
  link: string;
  name?: string;
  email?: string;
  phone?: string;
}

const ManagerCard: React.FC<ManagerCardProps> = ({ 
  link, 
  name = 'Tom', 
  email = 'Tom@example.com', 
  phone = '0712345678' 
}) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex flex-col gap-2 h-48 text-center justify-center items-center">
        <h1>{name}</h1>
        <p>{email}</p>
        <p>{phone}</p>
      </div>
    </Link>
  );
}

export default ManagerCard;