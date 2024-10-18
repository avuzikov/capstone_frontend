import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  return (
    <nav className="flex bg-adp-red text-adp-white p-large justify-between items-center">
      <Link to={"/"}>
        <div className="flex items-center gap-3">
          <img src="/adp-white.svg" alt="Logo" className="img-small mb-small" />
          <h1 className="text-large">Talent Site</h1>
        </div>
      </Link>

      <ul className="flex gap-4">
        <li className="cursor-pointer p-small">
          <Link
            to="/jobs"
            className={`hover:underline px-small py-small ${
              location.pathname.includes("jobs")
                ? "bg-adp-white text-adp-red rounded-md"
                : ""
            }`}
          >
            Jobs
          </Link>
        </li>
        <li className="cursor-pointer p-small">
          <Link
            to="/applications"
            className={`hover:underline px-small py-small ${
              location.pathname.includes("applications")
                ? "bg-adp-white text-adp-red rounded-md"
                : ""
            }`}
          >
            Applications
          </Link>
        </li>
        <li className="cursor-pointer p-small">
          <Link
            to="/profile"
            className={`hover:underline px-small py-small ${
              location.pathname.includes("profile")
                ? "bg-adp-white text-adp-red rounded-md"
                : ""
            }`}
          >
            Profile
          </Link>
        </li>
        <li className="cursor-pointer p-small">
          <Link
            to="/admin/dashboard"
            className={`hover:underline px-small py-small ${
              location.pathname.includes("admin")
                ? "bg-adp-white text-adp-red rounded-md"
                : ""
            }`}
          >
            Admin
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
