import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const AdminDashboardCard = ({ title, children, link }) => {
  return (
    <Link to={link} className="w-full">
      <div className="card-bordered cursor-pointer flex flex-col gap-3 h-36 text-center  justify-center items-center  ">
        {children}
        <h1 className="text-medium">{title}</h1>
      </div>
    </Link>
  );
};

AdminDashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    link: PropTypes.string.isRequired,
  };

export default AdminDashboardCard;
