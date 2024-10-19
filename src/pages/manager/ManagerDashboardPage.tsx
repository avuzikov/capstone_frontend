import React, { useState, useEffect } from 'react';
import ActiveJobsList from '../../components/manager/ActiveJobsList.tsx';
import JobForm from '../../components/manager/JobForm.tsx';

interface Job {
    id: number;
    listingTitle: string;
    dateListed: string;
    applicantsCount: number;
  }
  
  const mockFetchJobs = (): Promise<Job[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, listingTitle: 'Software Engineer', dateListed: '2023-05-01', applicantsCount: 5 },
          { id: 2, listingTitle: 'Product Manager', dateListed: '2023-05-03', applicantsCount: 3 },
          { id: 3, listingTitle: 'UX Designer', dateListed: '2023-05-05', applicantsCount: 7 },
        ]);
      }, 1000); // Simulate network delay
    });
  };
  
  const ManagerDashboardPage: React.FC = () => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingJob, setEditingJob] = useState<Job | null>(null);
  
    useEffect(() => {
      loadJobs();
    }, []);
  
    const loadJobs = async () => {
      setLoading(true);
      try {
        const fetchedJobs = await mockFetchJobs();
        setJobs(fetchedJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        // Handle error (e.g., show error message to user)
      } finally {
        setLoading(false);
      }
    };
  
    const addJob = (newJob: Omit<Job, 'id'>) => {
      const job = { ...newJob, id: Date.now(), applicantsCount: 0 };
      setJobs([...jobs, job]);
    };
  
    const updateJob = (updatedJob: Job) => {
      setJobs(jobs.map(job => job.id === updatedJob.id ? updatedJob : job));
      setEditingJob(null);
    };
  
    const deleteJob = (id: number) => {
      setJobs(jobs.filter(job => job.id !== id));
    };
  
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Hiring Manager Dashboard</h1>
        <JobForm onSubmit={editingJob ? updateJob : addJob} initialJob={editingJob} />
        {loading ? (
          <p>Loading jobs...</p>
        ) : (
          <ActiveJobsList 
            jobs={jobs} 
            onEdit={setEditingJob} 
            onDelete={deleteJob}
          />
        )}
      </div>
    );
  };
  
  export default ManagerDashboardPage;