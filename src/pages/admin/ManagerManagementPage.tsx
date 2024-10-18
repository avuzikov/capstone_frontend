import React from "react";
import { Link } from "react-router-dom";
import ManagerList from "../../components/admin/ManagerList.tsx";
import BackButton from "../../components/shared/BackButton.tsx";

const ManagerManagementPage = () => {
  return (
    <div className="flex flex-col gap-3 p-large">
      <div className="flex justify-between items-center">
        <BackButton />
        <Link to="/admin/newManager">
          <button className="btn-primary">New Manager</button>
        </Link>
      </div>
      <div className="flex justify-between">
        <h1 className="text-large">Manager Management</h1>
      </div>

      <ManagerList />
    </div>
  );
};

export default ManagerManagementPage;
