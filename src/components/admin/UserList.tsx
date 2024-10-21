// src\components\admin\UserList.tsx
import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import UserCard from './UserCard';
import { User } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  const fetchUsers = useCallback(async () => {
    if (!token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/users', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: User[] = await response.json();
      const applicants = data.filter(user => user.role === 'applicant');

      setUsers(applicants);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  }, [token]);

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
      {users.map(user => (
        <UserCard key={user.id} user={user} link={`/admin/user/${user.id}`} />
      ))}
    </div>
  );
};

export default UserList;
