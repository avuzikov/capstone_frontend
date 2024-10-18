import React from "react";
import ManagerList from "../../components/admin/ManagerList.tsx";
import BackButton from "../../components/shared/BackButton.tsx";

const ManagerManagementPage = () => {
  return (
    <div className="flex flex-col gap-4 p-large">
      <BackButton />
      <div className="flex justify-between">
        <h1 className="text-large">Manager Management</h1>
      </div>

      <ManagerList />
    </div>
  );
};

export default ManagerManagementPage;
