import React from "react";
import { useState, useEffect, useCallback } from "react";
import UserCard from "./UserCard.tsx";
import { User } from "../../mocks/types.ts";
import { useAuth } from "../../contexts/AuthContext.tsx";

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // use the auth context
  const { token } = useAuth();

  const fetchUsers = useCallback(async () => {
    try {
      console.log(token);

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
      const managers = data.filter((user) => user.role === "applicant");

      setUsers(managers);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      console.log(token);
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
        <UserCard key={user.id} user={user} link={`/admin/user/${user.id}`} />
      ))}
    </div>
  );
};

export default UserList;
