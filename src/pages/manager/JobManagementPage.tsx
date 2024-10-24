import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../../contexts/AuthContext';
import JobForm from '../../components/manager/JobForm';
import ApplicantList from '../../components/manager/ApplicantList';
import ApplicantStatusUpdate from '../../components/manager/ApplicantStatusUpdate';
import ApplicantSortOptions from '../../components/manager/ApplicantSortOptions';
import { Job, Application } from '../../types/types';

const JobManagementPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const { token, id } = useAuth();
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
      const response = await fetch(`http://localhost:8000/api/job/${jobId}`, {
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
      const response = await fetch(`http://localhost:8000/api/job/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...updatedJobData,
          id: parseInt(jobId),
          userId: parseInt(id ?? ''),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      setIsEditing(false);
      fetchJobDetails();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update job');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      navigate('/manager/console');
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
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-large font-bold">Job Management</h1>
          <div className="flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Edit Job
              </button>
            )}
            <button onClick={handleCancel} className="btn-secondary">
              {isEditing ? 'Cancel Edit' : 'Back to Dashboard'}
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <JobForm initialJob={job} onSubmit={handleUpdateJob} onCancel={handleCancel} />
      ) : (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">{job.listingTitle}</h2>
              <p className="text-sm text-gray-500">
                Posted on {new Date(job.dateListed).toLocaleDateString()}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Department</h3>
                  <p className="mt-1 text-gray-900">{job.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Job Title</h3>
                  <p className="mt-1 text-gray-900">{job.jobTitle}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        job.listingStatus === 'open'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {job.listingStatus.charAt(0).toUpperCase() + job.listingStatus.slice(1)}
                    </span>
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Experience Level</h3>
                  <p className="mt-1 text-gray-900">{job.experienceLevel}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Job Description</h3>
              <div className="mt-2 prose max-w-none">
                <ReactMarkdown>{job.jobDescription}</ReactMarkdown>
              </div>
            </div>

            {job.additionalInformation && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Additional Information</h3>
                <div className="mt-2 prose max-w-none">
                  <ReactMarkdown>{job.additionalInformation}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {!isEditing && (
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Applications</h2>
            </div>

            <div>
              <ApplicantSortOptions
                sortBy={sortBy}
                filterStatus={filterStatus}
                onSortChange={setSortBy}
                onFilterChange={setFilterStatus}
              />
              <ApplicantList jobId={parseInt(jobId!)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagementPage;
