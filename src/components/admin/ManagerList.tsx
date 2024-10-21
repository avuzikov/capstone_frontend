import React, { useCallback, useEffect, useState } from "react";
import ManagerCard from "./ManagerCard.tsx";
import { User } from "../../types/types.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";

const ManagerList: React.FC = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  

  const fetchManagers = useCallback(async () => {
    try {
      const response = await fetch("/users", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data: User[] = await response.json();
      const managers = data.filter((user) => user.role === "hiring-manager");

      setManagers(managers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

 
  useEffect(() => {
      fetchManagers();
  }, [fetchManagers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {managers.map((manager) => (
        <ManagerCard
          key={manager.id}
          manager={manager}
          link={`/admin/manager/${manager.id}`}
        />
      ))}
    </div>
  );
};

export default ManagerList;
