// src/pages/manager/JobManagementPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<Application['applicationStatus'] | 'all'>('all');

  // Calculate stats from applications data
  const applicationStats = useMemo(() => {
    if (!applications.length) return null;

    return {
      total: applications.length,
      pending: applications.filter(app => app.applicationStatus === 'pending').length,
      reviewed: applications.filter(app => app.applicationStatus === 'reviewed').length,
      accepted: applications.filter(app => app.applicationStatus === 'accepted').length,
      rejected: applications.filter(app => app.applicationStatus === 'rejected').length,
    };
  }, [applications]);

  const fetchJobDetails = async () => {
    if (!jobId || !token) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch job details
      const jobResponse = await fetch(`http://localhost:8000/api/job/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!jobResponse.ok) {
        throw new Error(
          jobResponse.status === 404 ? 'Job not found' : 'Failed to fetch job details'
        );
      }

      const jobData: Job = await jobResponse.json();
      setJob(jobData);

      // Fetch applications for the job
      const applicationsResponse = await fetch(
        `http://localhost:8000/api/job/${jobId}/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (applicationsResponse.ok) {
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'An error occurred while fetching job details';
      setError(errorMessage);
      if (errorMessage === 'Job not found') {
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

  // Sort and filter applications
  const processedApplications = useMemo(() => {
    let filtered = [...applications];

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(app => app.applicationStatus === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
      } else {
        // Sort by status priority: pending -> reviewed -> accepted -> rejected
        const statusPriority = { pending: 0, reviewed: 1, accepted: 2, rejected: 3 };
        return (
          (statusPriority[a.applicationStatus] || 0) - (statusPriority[b.applicationStatus] || 0)
        );
      }
    });

    return filtered;
  }, [applications, sortBy, filterStatus]);

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
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job');
      }

      const updatedJob = await response.json();
      setJob(updatedJob);
      setIsEditing(false);
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
      <div className="mb-2">
        <div className="flex justify-between items-center">
          <h1 className="text-large font-bold">Job Management</h1>
          <div className="flex gap-2">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-primary">
                Edit Job
              </button>
            )}
            <button onClick={handleCancel} className="btn-primary">
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>

      {isEditing ? (
        <JobForm initialJob={job} onSubmit={handleUpdateJob} onCancel={() => setIsEditing(false)} />
      ) : (
        <div className="card-bordered">
          <h2 className="text-medium font-semibold mb-2">{job.listingTitle}</h2>
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
          <h2 className="text-large font-semibold mb-2">Applications</h2>
          {applicationStats && (
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="card-bordered p-4 text-center">
                <p className="text-gray-600">Total</p>
                <p className="text-xl font-bold">{applicationStats.total}</p>
              </div>
              <div className="card-bordered p-4 text-center">
                <p className="text-yellow-600">Pending</p>
                <p className="text-xl font-bold">{applicationStats.pending}</p>
              </div>
              <div className="card-bordered p-4 text-center">
                <p className="text-blue-600">Reviewed</p>
                <p className="text-xl font-bold">{applicationStats.reviewed}</p>
              </div>
              <div className="card-bordered p-4 text-center">
                <p className="text-green-600">Accepted</p>
                <p className="text-xl font-bold">{applicationStats.accepted}</p>
              </div>
              <div className="card-bordered p-4 text-center">
                <p className="text-red-600">Rejected</p>
                <p className="text-xl font-bold">{applicationStats.rejected}</p>
              </div>
            </div>
          )}
          <div className="card-bordered">
            <ApplicantSortOptions
              sortBy={sortBy}
              filterStatus={filterStatus}
              onSortChange={setSortBy}
              onFilterChange={setFilterStatus}
              isLoading={isLoading}
              totalApplications={applicationStats?.total}
            />
            <ApplicantList jobId={parseInt(jobId!)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default JobManagementPage;
