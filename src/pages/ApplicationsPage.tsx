// src\pages\ApplicationsPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fecthApplications } from '../contexts/JobApi';
import ApplicationList from '../components/applicant/ApplicationList';
import { JobDetailsType } from '@/types/Job';

interface Application {
  id: number;
  candidateId: number;
  job: JobDetailsType;
  dateApplied: string;
  applicationStatus: 'pending' | 'accepted' | 'rejected';
  coverLetter: string;
  customResume: string;
}

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const { token } = useAuth();
  const { id } = useAuth();
  const [page, setPage] = useState(0);
  const itemsPerPage = 1;
  const [first, setFirst] = useState(true);
  const [last, setLast] = useState(true);

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fecthApplications(page, itemsPerPage, token);
        const applications = data.content;
        const filteredApplications = applications.filter(
          (application: Application) => application.candidateId === parseInt(id!, 10)
        );

        setApplications(filteredApplications);
        setFirst(data.first);
        setLast(data.last);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, itemsPerPage]);

  return (
    <div>
      <div className="container mx-auto p-4">
        {loading ? (
          <h1>Loading applications...</h1>
        ) : (
          <ApplicationList applications={applications} />
        )}

        <div className="flex justify-between mt-4 items-center ">
          <button
            className={`btn-primary text-normal ${first ? 'btn-disabled cursor-not-allowed' : ''}`}
            disabled={first}
            onClick={() => setPage(prev => Math.max(prev - 1, 0))}
          >
            Previous
          </button>

          <span className="text-small">Page {page + 1}</span>
          <button
            className={`btn-primary  text-normal ${last ? 'btn-disabled cursor-not-allowed' : ''}`}
            onClick={() => setPage(prev => prev + 1)}
            disabled={last}
          >
            {' '}
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
export default ApplicationsPage;
