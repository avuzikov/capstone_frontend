// src/pages/manager/JobManagementPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import JobForm from '../../components/manager/JobForm';
import ApplicantList from '../../components/manager/ApplicantList';
import ApplicantStatusUpdate from '../../components/manager/ApplicantStatusUpdate';
import ApplicantSortOptions from '../../components/manager/ApplicantSortOptions';
import { Job, Application } from '../../types/types';

const JobManagementPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { token } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<Application['applicationStatus'] | 'all'>('all');

  const fetchJobDetails = async () => {
    if (!jobId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Job not found');
        }
        throw new Error('Failed to fetch job details');
      }

      const jobData: Job = await response.json();
      setJob(jobData);
    } catch (err) {
      const error =
        err instanceof Error ? err.message : 'An error occurred while fetching job details';
      setError(error);
      if (error === 'Job not found') {
        navigate('/manager/console');
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

    try {
      setIsLoading(true);
      const response = await fetch(`/api/job/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updatedJobData,
          id: jobId,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      // Show success message (optional)
      // You could add a toast notification here if you have a notification system

      // Navigate back to dashboard
      navigate('/manager/console');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
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
        <div className="text-center">Loading job details...</div>
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
                className="bg-[#0a2558] hover:bg-[#051838] text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
              >
                Edit Job
              </button>
            )}
            <button
              onClick={handleCancel}
              className="bg-[#0a2558] hover:bg-[#051838] text-white font-bold py-2 px-4 rounded-md disabled:opacity-50 transition-colors"
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
          <ApplicantList jobId={parseInt(jobId!)} />
        </div>
      )}
    </div>
  );
};

export default JobManagementPage;
