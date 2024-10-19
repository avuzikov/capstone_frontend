import React from "react";
import BackButton from "../../components/shared/BackButton.tsx";
import TableList from "../../components/admin/TableList.tsx";

const DataTableManagementPage = () => {
  return (
    <div className="flex flex-col gap-3 p-large">
      <BackButton />
      <div className="flex justify-between">
        <h1 className="text-large">Tables</h1>
      </div>
      <TableList />
    </div>
  );
};

export default DataTableManagementPage;
