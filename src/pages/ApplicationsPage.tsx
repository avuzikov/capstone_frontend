// src\pages\ApplicationsPage.tsx

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fecthApplications } from '../contexts/JobApi';
import ApplicationList from '../components/applicant/ApplicationList';

interface Application {
  id: number;
  userId: number;
  jobId: number;
  dateApplied: string;
  applicationStatus: 'pending' | 'accepted' | 'rejected';
  coverLetter: string;
  customResume: string;
  jobTitle?: string;
}

interface Job {
  id: string;
  userId: string;
  listingTitle: string;
  department: string;
  listingStatus: 'open' | 'closed';
  dateListed: string;
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  additionalInformation: string;
}

const ApplicationsPage: React.FC = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const { token } = useAuth();
  const { id } = useAuth();
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;
  const [noMoreApplications, setNoMoreApplications] = useState(false);

  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fecthApplications(page, itemsPerPage, token);
        const filteredApplications = data.filter(
          (application: Application) => application.userId === parseInt(id!, 10)
        );
        const filteredApplications2 = await addJobTitlesToApplications(filteredApplications);
        const nApplications = filteredApplications.length;

        const aux = await fecthApplications(page + 1, itemsPerPage, token);
        const auxFilter = aux.filter(
          (application: Application) => application.userId === parseInt(id!, 10)
        );
        const nAux = auxFilter.length;
        console.log('nApps aux: ' + nAux);
        if (nAux > 0) {
          setNoMoreApplications(false);
        } else {
          setNoMoreApplications(true);
        }

        console.log(nApplications);
        setApplications(filteredApplications2);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [page, itemsPerPage]);

  const fetchJobTitle = async (jobId: number): Promise<string> => {
    try {
      const response = await fetch(`/api/job/${jobId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Error fetching job title');
      }

      const data = await response.json();
      const job: Job = {
        id: data.id,
        userId: data.userId,
        listingTitle: data.listingTitle,
        department: data.department,
        listingStatus: data.listingStatus,
        dateListed: data.dateListed,
        jobTitle: data.jobTitle,
        jobDescription: data.jobDescription,
        experienceLevel: data.experienceLevel,
        additionalInformation: data.additionalInformation,
      };

      return job.jobTitle;
    } catch (error) {
      console.error(`Error fetching job title for job ID ${jobId}:`, error);
      return 'Unknown Job Title';
    }
  };

  const addJobTitlesToApplications = async (
    applications: Application[]
  ): Promise<Application[]> => {
    const applicationsWithJobTitles = await Promise.all(
      applications.map(async application => {
        const jobTitle = await fetchJobTitle(application.jobId);
        return { ...application, jobTitle }; // Añadimos el campo jobTitle
      })
    );

    return applicationsWithJobTitles;
  };

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
            className={`btn-primary text-normal ${
              page === 1 ? 'btn-disabled cursor-not-allowed' : ''
            }`}
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          >
            Previous
          </button>

          <span className="text-small">Page {page}</span>
          <button
            className={`btn-primary  text-normal ${
              noMoreApplications ? 'btn-disabled cursor-not-allowed' : ''
            }`}
            onClick={() => setPage(prev => prev + 1)}
            disabled={noMoreApplications}
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
