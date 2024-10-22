import React from 'react';
import UserForm from '../../components/admin/UserForm';
import { useAuth } from '../../contexts/AuthContext';
import { useState } from 'react';

const ProfilePage = () => {
  const { id } = useAuth();
  const [showForm, setShowForm] = useState(true);

  return (
    <div className="flex flex-col gap-3">
      {} <UserForm isEditing={true} userId={id || ''} />
    </div>
  );
};

export default ProfilePage;
