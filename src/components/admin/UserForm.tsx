// src\components\admin\UserForm.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Input from '../shared/Input';
import BackButton from '../shared/BackButton';
import { User } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface UserFormProps {
  isEditing: boolean;
  userId?: string;
  handleShowForm?: () => void;
}

export interface RegistrationData extends User {
  password: string;
}

const UserForm: React.FC<UserFormProps> = ({ isEditing, userId, handleShowForm }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState<RegistrationData>({
    id: 0,
    name: '',
    password: '',
    email: '',
    address: '',
    phone: '',
    resume: '',
    role: 'applicant',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    password: '',
    email: '',
    address: '',
    phone: '',
    resume: '',
  });

  const { token } = useAuth();

  let url: string;

  if (userId != '' && userId != undefined) {
    url = `http://localhost:8180/users/${userId}`;
  } else {
    url = `http://localhost:8180/users/${id}`;
  }

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch(url, {
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
      setFormData(prevData => ({
        ...data,
        password: prevData.password,
      }));
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  }, [id, token]);

  const createUser = async () => {
    try {
      const response = await fetch('http://localhost:8180/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
          email: formData.email,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create user');
      }

      const data = await response.json();
      console.log('User created:', data);
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const updateUser = async () => {
    try {
      const response = await fetch(`http://localhost:8180/users/admin/${userId || id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to update this user.');
        }
        throw new Error('Failed to update user');
      }

      fetchUser();
    
    } catch (error) {
      console.error('Failed to update user:', error);
    }
  };

  const deleteUser = async () => {
    try {
      const response = await fetch(`http://localhost:8180/users/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });


      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      navigate(-1);
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  useEffect(() => {
    if (isEditing && token) {
      fetchUser();
    }
  }, [isEditing, token, fetchUser]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const errors = {
      name: '',
      password: '',
      email: '',
      address: '',
      phone: '',
      resume: '',
    };

    if (!formData.name) {
      errors.name = 'Full name is required';
    }
    if (!formData.password && !isEditing) {
      errors.password = 'Password is required';
    }
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email address is invalid';
    }
    if (!formData.address && isEditing) {
      errors.address = 'Address is required';
    }
    if (!formData.phone && isEditing) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.resume && isEditing) {
      errors.resume = 'Resume is required';
    }

    setFormErrors(errors);

    return !Object.values(errors).some(error => error);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        updateUser();
      } else {
        createUser();

        navigate(-1);
      }


      if (handleShowForm) {
        handleShowForm();
      }
    }
  };

  return (
    <div className="m-medium flex flex-col gap-3">
      {!userId && <BackButton />}
      <div className="flex flex-col justify-center items-center">
        {isEditing && !userId && <h1 className="text-large w-full lg:w-1/2">Edit User</h1>}
        {isEditing && userId && <h1 className="text-large w-full lg:w-1/2">Edit Profile</h1>}
        {!isEditing && !userId && <h1 className="text-large w-full lg:w-1/2">Add User</h1>}

        <form onSubmit={handleSubmit} className="card-bordered mt-2 w-full lg:w-1/2">
          <div className="p-medium md:p-large flex flex-col gap-4">
            <Input
              name="name"
              placeholder="Enter full name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
            />
            {!isEditing && (
              <Input
                name="password"
                placeholder="Enter password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={formErrors.password}
              />
            )}
            <Input
              name="email"
              placeholder="Enter email"
              type="email"
              value={formData.email}
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
                <button type="button" className="btn-destructive w-full" onClick={deleteUser}>
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
