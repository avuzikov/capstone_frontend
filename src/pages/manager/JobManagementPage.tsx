// src/pages/manager/JobManagementPage.tsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import JobForm from '../../components/manager/JobForm';
import ApplicantList from '../../components/manager/ApplicantList';
import ApplicantStatusUpdate from '../../components/manager/ApplicantStatusUpdate';
import ApplicantSortOptions from '../../components/manager/ApplicantSortOptions';
import { jobService } from '../../services/jobService';
import { ApiError } from '../../services/apiClient';
import { Job } from '../../services/types';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

const JobManagementPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<
    'all' | 'pending' | 'reviewed' | 'accepted' | 'rejected'
  >('all');

  const fetchJobDetails = async () => {
    if (!jobId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const jobData = await jobService.getJobById(jobId);
      setJob(jobData);
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 404) {
          navigate('/manager/console');
        }
        setError(err.message);
      } else {
        setError('Failed to fetch job details');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && jobId) {
      fetchJobDetails();
    }
  }, [token, jobId, isEditing]);

  const handleUpdateJob = async (updatedJobData: Partial<Job>) => {
    if (!jobId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      await jobService.updateJob(jobId, {
        ...updatedJobData,
        id: parseInt(jobId),
      });
      navigate('/manager/console');
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError('Failed to update job');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/manager/console');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Job not found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Job Management</h1>
          <div className="flex gap-4">
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
              >
                Edit Job
              </button>
            )}
            <button
              onClick={handleCancel}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <JobForm initialJob={job} onSubmit={handleUpdateJob} onCancel={handleCancel} />
      ) : (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">{job.listingTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-medium">Department</p>
              <p>{job.department}</p>
            </div>
            <div>
              <p className="font-medium">Status</p>
              <p>{job.listingStatus}</p>
            </div>
            <div>
              <p className="font-medium">Job Title</p>
              <p>{job.jobTitle}</p>
            </div>
            <div>
              <p className="font-medium">Experience Level</p>
              <p>{job.experienceLevel}</p>
            </div>
          </div>
          <div className="mb-4">
            <p className="font-medium">Job Description</p>
            <p className="whitespace-pre-wrap">{job.jobDescription}</p>
          </div>
          {job.additionalInformation && (
            <div>
              <p className="font-medium">Additional Information</p>
              <p className="whitespace-pre-wrap">{job.additionalInformation}</p>
            </div>
          )}
        </div>
      )}

      {!isEditing && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-6">Applications</h2>
          <ApplicantSortOptions
            sortBy={sortBy}
            filterStatus={filterStatus}
            onSortChange={setSortBy}
            onFilterChange={setFilterStatus}
          />
          <ApplicantList jobId={parseInt(jobId!, 10)} />
        </div>
      )}
    </div>
  );
};

export default JobManagementPage;
