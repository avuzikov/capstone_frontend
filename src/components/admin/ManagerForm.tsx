// src\components\admin\ManagerForm.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../shared/Input';
import { User } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';
import apiClient from '../../services/api/apiClient';

interface ManagerFormProps {
  isEditing: boolean;
  initialData?: Partial<User>;
  onSubmit: (formData: Partial<User>) => Promise<void>;
  onDelete?: () => Promise<void>;
}

const ManagerForm: React.FC<ManagerFormProps> = ({
  isEditing,
  initialData,
  onSubmit,
  onDelete,
}) => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    department: '',
    role: 'hiring-manager',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData(prevData => ({ ...prevData, ...initialData }));
    }
  }, [isEditing, initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    setFormErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!formData.fullName) errors.fullName = 'Full name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!isEditing && !formData.password) errors.password = 'Password is required';
    if (isEditing && !formData.phone) errors.phone = 'Phone number is required';
    if (isEditing && !formData.department) errors.department = 'Department is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      await onSubmit(formData);
      navigate(-1);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete();
      navigate(-1);
    }
  };

  return (
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
              name="phone"
              placeholder="Enter phone number"
              type="text"
              value={formData.phone || ''}
              onChange={handleChange}
              error={formErrors.phone}
            />
            <Input
              name="department"
              placeholder="Enter department"
              type="text"
              value={formData.department || ''}
              onChange={handleChange}
              error={formErrors.department}
            />
          </>
        )}
        <div className="flex gap-3 mt-4 justify-end">
          {isEditing && onDelete && (
            <button type="button" onClick={handleDelete} className="btn-destructive w-full">
              Delete
            </button>
          )}
          <button type="submit" className="btn-primary w-full">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default ManagerForm;
