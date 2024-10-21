// src\components\admin\TableList.tsx
import React from "react";
import TableCard from "./TableCard";

const tables = [
  { name: 'Users', link: '/admin/tables/users' },
  { name: 'Jobs', link: '/admin/tables/jobs' },
  { name: 'Applications', link: '/admin/tables/applications' },
];

const TableList = () => {
  return (
    <div className="flex flex-col gap-3">
      {tables.map(table => (
        <TableCard key={table.name} link={table.link} name={table.name} />
      ))}
    </div>
  );
};

export default TableList;
