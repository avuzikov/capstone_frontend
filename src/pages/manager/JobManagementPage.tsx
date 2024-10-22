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

  // Fetch job details
  const fetchJobDetails = async () => {
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
      setError(err instanceof Error ? err.message : 'An error occurred while fetching job details');
      if (err instanceof Error && err.message === 'Job not found') {
        // Redirect to manager console if job not found
        navigate('/manager/console');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobDetails();
  }, [jobId]);

  // Update job details
  const handleUpdateJob = async (updatedJobData: Partial<Job>) => {
    setError(null);

    try {
      const response = await fetch(`/api/job/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedJobData),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      const updatedJob: Job = await response.json();
      setJob(updatedJob);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
    }
  };

  // Delete job
  const handleDeleteJob = async () => {
    if (!window.confirm('Are you sure you want to delete this job listing?')) {
      return;
    }

    try {
      const response = await fetch(`/api/job/${jobId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Redirect to manager console after successful deletion
      navigate('/manager/console');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete job');
    }
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
          <div className="space-x-4">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Job'}
            </button>
            <button
              onClick={handleDeleteJob}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Delete Job
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <JobForm initialJob={job} onSubmit={handleUpdateJob} onCancel={() => setIsEditing(false)} />
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
    </div>
  );
};

export default JobManagementPage;
