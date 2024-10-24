// src\components\admin\ManagerForm.tsx

import React, { useState, useEffect, useCallback } from 'react';
import Input from '../shared/Input';
import BackButton from '../shared/BackButton';
import { User, Job } from '../../types/types';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import JobTransferCard from './JobTransferCard';
import { useAuth } from '../../contexts/AuthContext';

interface ManagerFormProps {
  isEditing: boolean;
}

export interface RegistrationData extends User {
  password: string;
}

const ManagerForm: React.FC<ManagerFormProps> = ({ isEditing }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [formData, setFormData] = useState<RegistrationData>({
    id: 0,
    name: '',
    password: '',
    email: '',
    phone: '',
    department: '',
    role: 'hiring-manager',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    password: '',
    email: '',
    phone: '',
    department: '',
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [shouldFetchJobs, setShouldFetchJobs] = useState<boolean>(true);

  const handleShouldFetchJobs = () => {
    setShouldFetchJobs(prev => !prev);
  };

  const fetchManager = useCallback(async () => {
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

      const data: User = await response.json();
      setFormData(prevData => ({
        ...data,
        password: prevData.password,
      }));
    } catch (error) {
      console.error('Failed to fetch manager data:', error);
    }
  }, [id, token]);

  useEffect(() => {
    if (token) {
      fetchManager();
    }
  }, [token, fetchManager]);

  const createManager = async () => {
    try {
      const response = await fetch('http://localhost:8180/registration/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          password: formData.password,
          email: formData.email
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create manager');
      }

      const data = await response.json();
      fetchManager();
    } catch (error) {
      console.error('Failed to create manager:', error);
    }
  };

  const updateManager = async () => {
    try {
      const response = await fetch(`http://localhost:8180/users/admin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Forbidden: You do not have permission to update this manager.');
        }
        throw new Error('Failed to update manager');
      }

      const data = await response.json();
      console.log('Applicant updated:', data);
      fetchManager();

      navigate(-1);
    } catch (error) {
      console.error('Failed to update manager:', error);
    }
  };

  const deleteManager = async () => {
    if (jobs.length > 0) {
      alert(
        'Cannot delete manager with active jobs. Please transfer all jobs to another manager first.'
      );
      return;
    }

    try {
      const response = await fetch(`http://localhost:8180/users/admin/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      navigate(-1);

      if (!response.ok) {
        throw new Error('Failed to delete applicant');
      }
    } catch (error) {
      console.error('Failed to delete applicant:', error);
    }
  };

  const fetchJobs = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8000/api/job', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      const filteredJobs = data.filter((job: Job) => job.userId.toString() === id);

      setJobs(filteredJobs);
    } catch (err) {
      console.error(err);
    }
  }, [id, token]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs, shouldFetchJobs]);

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
      phone: '',
      department: '',
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
    if (!formData.phone && isEditing) {
      errors.phone = 'Phone number is required';
    }
    if (!formData.department && isEditing) {
      errors.department = 'Department is required';
    }

    setFormErrors(errors);

    return Object.values(errors).every(err => err === '');
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (isEditing) {
        updateManager();
      } else {
        createManager();
        navigate(-1);
      }

    }
  };

  return (
    <div className="m-medium flex flex-col gap-3">
      <BackButton />
      <div className="flex flex-col justify-center  items-center">
        <h1 className="text-large w-full lg:w-1/2">
          {' '}
          {isEditing ? 'Edit Manager' : 'Add Manager'}{' '}
        </h1>
        <form onSubmit={handleSubmit} className="card-bordered w-full  mt-2 lg:w-1/2">
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
              {isEditing && (
                <button type="button" onClick={deleteManager} className="btn-destructive w-full">
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

      {jobs.length > 0 && (
        <div className="flex justify-center mt-6 items-center">
          <JobTransferCard
            currentManagerId={id || ''}
            jobs={jobs}
            handleShouldFetchJobs={handleShouldFetchJobs}
          />
        </div>
      )}
    </div>
  );
};

export default ManagerForm;
