import React from "react";
import TableCard from "./TableCard.tsx";

const tables = [
  { name: "Jobs", link: "/admin/tables/jobs" },
  { name: "Users", link: "/admin/tables/users" },
  { name: "Applications", link: "/admin/tables/applications" },
];

const TableList = () => {
  return (
    <div className="flex flex-col gap-3">
      {tables.map((table) => (
        <TableCard key={table.name} link={table.link} name={table.name} />
      ))}
    </div>
  );
};

export default TableList;
