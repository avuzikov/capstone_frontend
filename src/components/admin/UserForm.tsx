// src\components\admin\UserForm.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Input from '../shared/Input';
import BackButton from '../shared/BackButton';
import { User } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api/apiClient';
import {
  validateForm,
  validateEmail,
  validateRequired,
  validatePassword,
} from '../../utils/validationUtils';

interface UserFormProps {
  isEditing: boolean;
  userId?: string;
}

const UserForm: React.FC<UserFormProps> = ({ isEditing, userId }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    password: '',
    email: '',
    address: '',
    phone: '',
    resume: '',
    role: 'applicant',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchUserData = async () => {
      if (isEditing && token) {
        try {
          const user = await apiClient.fetchManager(userId || id || '', token);
          if (user) {
            setFormData(user);
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, [isEditing, token, userId, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateUserForm = () => {
    const validations = {
      fullName: validateRequired,
      email: validateEmail,
      password: isEditing ? () => null : validatePassword,
      address: isEditing ? validateRequired : () => null,
      phone: isEditing ? validateRequired : () => null,
      resume: isEditing ? validateRequired : () => null,
    };

    const errors = validateForm(formData as Record<string, string>, validations);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateUserForm()) {
      try {
        if (isEditing && token) {
          await apiClient.updateUser(userId || id || '', formData, token);
        } else if (token) {
          await apiClient.createUser(formData, token);
        }
        navigate(-1);
      } catch (error) {
        console.error('Failed to save user:', error);
      }
    }
  };

  const handleDelete = async () => {
    const userIdToDelete = userId || id;
    if (userIdToDelete && token) {
      try {
        await apiClient.deleteUser(userIdToDelete, token);
        navigate(-1);
      } catch (error) {
        console.error('Failed to delete user:', error);
      }
    } else {
      console.error('No user ID available for deletion');
    }
  };

  return (
    <div className="m-medium flex flex-col gap-3">
      <BackButton />
      <div className="flex flex-col justify-center items-center">
        {isEditing && !userId && <h1 className="text-large w-full lg:w-1/2">Edit User</h1>}
        {isEditing && userId && <h1 className="text-large w-full lg:w-1/2">Profile</h1>}
        {!isEditing && !userId && <h1 className="text-large w-full lg:w-1/2">Add User</h1>}

        <form onSubmit={handleSubmit} className="card-bordered mt-2 w-full lg:w-1/2">
          <div className="p-medium md:p-large flex flex-col gap-4">
            <Input
              name="fullName"
              placeholder="Enter full name"
              type="text"
              value={formData.fullName || ''}
              onChange={handleChange}
              error={formErrors.fullName}
            />
            {!isEditing && (
              <Input
                name="password"
                placeholder="Enter password"
                type="password"
                value={formData.password || ''}
                onChange={handleChange}
                error={formErrors.password}
              />
            )}
            <Input
              name="email"
              placeholder="Enter email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
              error={formErrors.email}
            />

            {isEditing && (
              <>
                <Input
                  name="address"
                  placeholder="Enter address"
                  type="text"
                  value={formData.address || ''}
                  onChange={handleChange}
                  error={formErrors.address}
                />
                <Input
                  name="phone"
                  placeholder="Enter phone number"
                  type="text"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  error={formErrors.phone}
                />
                <Input
                  name="resume"
                  placeholder="Enter resume"
                  isTextArea={true}
                  value={formData.resume || ''}
                  onChange={handleChange}
                  error={formErrors.resume}
                />
              </>
            )}

            <div className="flex gap-3 mt-4 justify-end">
              {isEditing && !userId && (
                <button type="button" className="btn-destructive w-full" onClick={handleDelete}>
                  Delete
                </button>
              )}
              <button type="submit" className="btn-primary w-full">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserForm;
