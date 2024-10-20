import React from "react";
import { useState, useEffect, useCallback } from "react";
import UserCard from "./UserCard.tsx";
import { User } from "../../mocks/types.ts";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>("");

  const fetchToken = async () => {
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

      setToken(token);
    } catch (error) {
      console.error("Failed to get token:", error);
    }
  };

    const fetchUsers = useCallback(async () => {
      try {
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
        const managers = data.filter((user) => user.role === "applicant");

        setUsers(managers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }, [token]);

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token, fetchUsers]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {users.map((user) => (
        <UserCard
          key={user.id}
          user={user}
          link={`/admin/user/${user.id}`}
        />
      ))}
    </div>
  );
};

export default UserList;
