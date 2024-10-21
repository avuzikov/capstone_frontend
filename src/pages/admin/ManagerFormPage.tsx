// src/pages/admin/ManagerFormPage.tsx

import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackButton from '../../components/shared/BackButton';
import { User, Job } from '../../types/types';
import { useNavigate } from 'react-router-dom';
import JobTransferCard from '../../components/admin/JobTransferCard';
import { useAuth } from '../../contexts/AuthContext';
import ManagerForm from '../../components/admin/ManagerForm';
import {
  fetchManager,
  createManager,
  updateManager,
  deleteManager,
  fetchJobs,
} from '../../utils/apiUtils';

interface ManagerFormPageProps {
  isEditing: boolean;
}

const ManagerFormPage: React.FC<ManagerFormPageProps> = ({ isEditing }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [shouldFetchJobs, setShouldFetchJobs] = useState<boolean>(true);
  const [initialData, setInitialData] = useState<Partial<User> | undefined>(undefined);

  const handleShouldFetchJobs = () => {
    setShouldFetchJobs(prev => !prev);
  };

  const fetchManagerData = useCallback(async () => {
    if (!id || !token) return;
    try {
      const data = await fetchManager(id, token);
      setInitialData(data);
    } catch (error) {
      console.error('Failed to fetch manager data:', error);
    }
  }, [id, token]);

  useEffect(() => {
    if (isEditing && token) {
      fetchManagerData();
    }
  }, [isEditing, token, fetchManagerData]);

  const handleCreateManager = async (formData: Partial<User>) => {
    try {
      await createManager(formData, token);
      console.log('Manager created successfully');
      navigate(-1);
    } catch (error) {
      console.error('Failed to create manager:', error);
    }
  };

  const handleUpdateManager = async (formData: Partial<User>) => {
    if (!id) return;
    try {
      await updateManager(id, formData, token);
      console.log('Manager updated successfully');
      navigate(-1);
    } catch (error) {
      console.error('Failed to update manager:', error);
    }
  };

  const handleDeleteManager = async () => {
    if (!id) return;
    if (jobs.length > 0) {
      alert(
        'Cannot delete manager with active jobs. Please transfer all jobs to another manager first.'
      );
      return;
    }

    try {
      await deleteManager(id, token);
      console.log('Manager deleted successfully');
      navigate(-1);
    } catch (error) {
      console.error('Failed to delete manager:', error);
    }
  };

  const fetchJobsData = useCallback(async () => {
    if (!id || !token) return;
    try {
      const allJobs = await fetchJobs(token);
      const filteredJobs = allJobs.filter(job => job.userId.toString() === id);
      setJobs(filteredJobs);
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    }
  }, [id, token]);

  useEffect(() => {
    fetchJobsData();
  }, [fetchJobsData, shouldFetchJobs]);

  const handleSubmit = isEditing ? handleUpdateManager : handleCreateManager;

  return (
    <div className="m-medium flex flex-col gap-3">
      <BackButton />
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-large w-full lg:w-1/2">{isEditing ? 'Edit Manager' : 'Add Manager'}</h1>
        <ManagerForm
          isEditing={isEditing}
          initialData={initialData}
          onSubmit={handleSubmit}
          onDelete={isEditing ? handleDeleteManager : undefined}
        />
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

export default ManagerFormPage;
