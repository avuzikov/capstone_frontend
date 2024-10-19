import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();

  const getFirstSegment = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || "";
  };

  const firstSegment = getFirstSegment(location.pathname);

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
              firstSegment === "jobs" || location.pathname === "/"
                ? "bg-adp-white shadow-md text-adp-red rounded-md"
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
              firstSegment === "applications"
              ? "bg-adp-white shadow-md text-adp-red rounded-md"
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
              firstSegment === "profile"
              ? "bg-adp-white shadow-md text-adp-red rounded-md"
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
              firstSegment === "admin"
              ? "bg-adp-white shadow-md text-adp-red rounded-md"
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