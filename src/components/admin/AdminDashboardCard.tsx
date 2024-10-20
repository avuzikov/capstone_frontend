import React from "react";
import { Link } from "react-router-dom";

interface AdminDashboardCardProps {
  title: string;
  children: React.ReactNode;
  link: string;
}

const AdminDashboardCard: React.FC<AdminDashboardCardProps> = ({ title, children, link }) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex flex-col gap-2 h-48 text-center justify-center items-center">
        {children}
        <h1>{title}</h1>
      </div>
    </Link>
  );
};

export default AdminDashboardCard;