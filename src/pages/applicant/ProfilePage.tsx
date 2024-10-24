// src\pages\applicant\ProfilePage.tsx

import React from 'react';
import UserForm from '../../components/admin/UserForm';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useCallback, useEffect } from 'react';
import { User } from '../../types/types';

const ProfilePage = () => {
  const { id, token } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  console.log('Profile page rerendering!');

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8180/users/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
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
  }, [token, showForm]);

  

  return (
    <div className="w-full flex items-center  flex-col justify-center">
      <div className="flex flex-col w-full gap-3 m-medium lg:w-1/2 justify-center">
        {user && (
          <div>
            <h1 className="text-large pb-2">Profile</h1>
            <div className="card-bordered flex gap-4 flex-col">
              <div className="m-small">
                {Object.entries(user).map(([key, value]) => {
                  if ( key === 'name') {
                    return (
                      <div className="mb-3" key={key}>
                        <p className="text-small pl-small">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <div className="card-bordered">{value}</div>
                      </div>
                    );
                  }
                  return null;
                })}
                {Object.entries(user).map(([key, value]) => {
                  if ( key !== 'name' && (key === 'email' || key === 'address' || key === 'phone' || key === 'resume')) {
                    return (
                      <div className="mb-3" key={key}>
                        <p className="text-small pl-small">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </p>
                        <div className="card-bordered">{value}</div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          {showForm ? 'Hide Form' : 'Edit Profile'}
        </button>
      </div>

      <div className="flex flex-col w-full gap-3">
        {showForm && (
          <UserForm
            isEditing={true}
            userId={user?.id?.toString()}
            setShowForm={setShowForm}
          />
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
