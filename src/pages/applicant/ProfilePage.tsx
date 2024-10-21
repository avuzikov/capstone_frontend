// src\pages\applicant\ProfilePage.tsx
import React from 'react';
import UserForm from '../../components/admin/UserForm';
import { useAuth } from '../../contexts/AuthContext';

const ProfilePage = () => {
  const { id } = useAuth();

  return <UserForm isEditing={true} userId={id || ''} />;
};

export default ProfilePage;
