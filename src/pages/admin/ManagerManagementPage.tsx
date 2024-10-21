// src\pages\admin\ManagerManagementPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import ManagerList from "../../components/admin/ManagerList";
import BackButton from "../../components/shared/BackButton";

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
        <h1 className="text-large">Managers</h1>
      </div>

      <ManagerList />
    </div>
  );
};

export default ManagerManagementPage;
