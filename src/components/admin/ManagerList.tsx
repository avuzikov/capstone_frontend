import React, { useEffect, useState } from "react";
import ManagerCard from "./ManagerCard.tsx";
import { User } from "../../mocks/types";

const ManagerList: React.FC = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchManagers = async () => {
      try {
        const loginResponse = await fetch("/users/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: "admin@example.com",
            password: "password",
          }),
        });

        if (!loginResponse.ok) {
          throw new Error("Failed to login");
        }

        const token = loginResponse.headers.get("Authorization");

        if (!token) {
          throw new Error("No token received");
        }

        const response = await fetch("/users", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
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
    };

    fetchManagers();
  }, []);

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
