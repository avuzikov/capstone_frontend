// src\components\admin\ManagerList.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import ManagerCard from './ManagerCard';
import { User } from '../../types/types';
import apiClient from '../../services/api/apiClient';

const ManagerList: React.FC = () => {
  const [managers, setManagers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  const fetchManagers = useCallback(async () => {
    if (!token) {
      setError('No authentication token available');
      setLoading(false);
      return;
    }

    try {
      const data = await apiClient.fetchUsers(token);
      const managers = data.filter(user => user.role === 'hiring-manager');
      setManagers(managers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
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
      {managers.map(manager => (
        <ManagerCard key={manager.id} manager={manager} link={`/admin/manager/${manager.id}`} />
      ))}
    </div>
  );
};

export default ManagerList;
