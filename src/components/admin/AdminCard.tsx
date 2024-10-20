import { Link } from "react-router-dom";
import React from "react";

interface AdminCardProps {
    link: string;
    name?: string;
    email?: string;
    phone?: string;
  }
  
const AdminCard: React.FC<AdminCardProps> = ({ link, name = 'Tom', email = 'Tom@example.com', phone = '0712345678' }) => {
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
