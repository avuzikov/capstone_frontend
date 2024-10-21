import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext.tsx";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, logout } = useAuth();
  const { role } = useAuth();

  const getFirstSegment = (pathname: string) => {
    const segments = pathname.split("/").filter(Boolean);
    return segments[0] || "";
  };

  const firstSegment = getFirstSegment(location.pathname);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex bg-adp-red text-adp-white p-large justify-between items-center">
      <Link to={"/"}>
        <div className="flex items-center gap-3">
          <img src="/adp-white.svg" alt="Logo" className="img-small mb-small" />
          <h1 className="hidden md:block text-large">Talent Site</h1>
        </div>
      </Link>

      <ul className="flex gap-1">
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
        {role === "admin" && (
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
        )}

        {token && (
          <li className="cursor-pointer p-small">
            <button
              onClick={handleLogout}
              className="hover:underline inline px-small"
            >
              Logout
            </button>
          </li>
        )}

        {!token && (
          <li className="cursor-pointer p-small">
            <Link className="hover:underline" to="/login">Login</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Header;
