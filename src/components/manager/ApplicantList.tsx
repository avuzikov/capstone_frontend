import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplicantStatusUpdate from './ApplicantStatusUpdate';
import { Application } from '../../types/types';
import { useAuth } from '../../contexts/AuthContext';

interface ApplicantListProps {
  jobId: number;
}

type ApplicationStatus = Application['applicationStatus'];

interface ApplicationWithUser extends Application {
  applicantName?: string;
}

const ApplicantList: React.FC<ApplicantListProps> = ({ jobId }) => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<ApplicationWithUser[]>([]);
  const [currentPage, setCurrentPage] = useState(0); // Changed to 0-based for Spring pagination
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 5;

  const fetchApplications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Using the Spring backend endpoint
      const response = await fetch(
        `http://localhost:8000/api/job/${jobId}/applications?page=${currentPage}&items=${itemsPerPage}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          setApplications([]);
          setTotalPages(1);
          return;
        }
        throw new Error('Failed to fetch applications');
      }

      const data = await response.json();

      // Handle Spring Pageable response format
      setApplications(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An error occurred while fetching applications'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token && jobId) {
      fetchApplications();
    }
  }, [jobId, currentPage, token]);

  const handleStatusChange = async (applicantId: number, newStatus: ApplicationStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/application/manager/${applicantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ applicationStatus: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update application status');
      }

      const updatedApplication: Application = await response.json();

      // Update local state
      setApplications(prev =>
        prev.map(app =>
          app.id === applicantId
            ? { ...app, applicationStatus: updatedApplication.applicationStatus }
            : app
        )
      );

      // Refresh the applications list
      fetchApplications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleJobStatusUpdate = () => {
    navigate(`/manager/${jobId}`);
  };

  if (isLoading) {
    return <div className="text-center py-4">Loading applications...</div>;
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date Applied
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {applications.map(application => (
            <tr key={application.id}>
              <td className="px-6 py-4 whitespace-nowrap">{application.applicantName}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(application.dateApplied).toLocaleDateString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">{application.applicationStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <ApplicantStatusUpdate
                  applicationId={application.id}
                  jobId={jobId}
                  currentStatus={application.applicationStatus}
                  onStatusChange={newStatus => handleStatusChange(application.id, newStatus)}
                  onJobStatusUpdate={handleJobStatusUpdate}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {applications.length === 0 && (
        <div className="text-center py-4 text-gray-500">No applications found for this job.</div>
      )}

      {applications.length > 0 && (
        <div className="mt-4 flex px-small justify-between">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 0))}
            disabled={currentPage === 0}
            className="btn-disabled disabled:opacity-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages - 1))}
            disabled={currentPage === totalPages - 1}
            className="btn-disabled disabled:opacity-50 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ApplicantList;
