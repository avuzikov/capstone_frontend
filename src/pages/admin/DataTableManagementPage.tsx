import React from "react";
import BackButton from "../../components/shared/BackButton.tsx";

const DataTableManagementPage = () => {
  return (
    <div className="flex flex-col gap-4 p-large">
      <BackButton />
      <div className="flex justify-between">
        <h1 className="text-large">Data Table Management</h1>
      </div>
    </div>
  );
};

export default DataTableManagementPage;
