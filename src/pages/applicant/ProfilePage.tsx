import React from 'react';
import UserForm from '../../components/admin/UserForm';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useCallback, useEffect } from 'react';
import { User } from '../../types/types';

const ProfilePage = () => {
  const { id, token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data: User = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [id, token]);

  useEffect(() => {
    if (token) {
      fetchUser();
    }
  }, [token, fetchUser]);

  return (
    <>
      <div className="flex flex-col m-large gap-3">
        {/* dislay user details */}
        {user && (
          <div className="card-bordered">
            <div>{user.fullName}</div>
            <div>{user.email}</div>
            <div>{user.address}</div>
            <div>{user.phone}</div>
            <div>{user.resume}</div>
          </div>
        )}
        <button onClick={() => setShowForm(!showForm)} className='btn-secondary'>
          {showForm ? 'Hide Form' : 'Edit Profile'}
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {showForm && <UserForm isEditing={true} userId={id || ''} />}
      </div>
    </>
  );
};

export default ProfilePage;
