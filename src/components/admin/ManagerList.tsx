import React from "react";
import ManagerCard from "./ManagerCard.tsx";

const ManagerList = () => {
  return (
    <div className="flex flex-col gap-4">
        {[...Array(20)].map((_, i) => (
          <ManagerCard key={i} link="/admin/manager/1" />
        ))}
      
    </div>

  )
};

export default ManagerList;
