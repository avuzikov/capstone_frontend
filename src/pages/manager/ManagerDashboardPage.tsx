import React, { useState } from 'react';
import ActiveJobsList from '../../components/manager/ActiveJobsList';
import JobForm from '../../components/manager/JobForm';
import { addJob } from '../../mocks/mockData';

const ManagerDashboardPage: React.FC = () => {
  const [showJobForm, setShowJobForm] = useState<boolean>(false);
  const [shouldUpdateJobs, setShouldUpdateJobs] = useState<boolean>(false);

  const handleShouldUpdateJobs = () => {
    setShouldUpdateJobs(true);
  }

  const handleCreateJob = (jobData: any) => {
    addJob(jobData);
    setShowJobForm(false);
    // In a real application, you might want to refresh the ActiveJobsList here
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Manager Dashboard</h1>
      <button
        onClick={() => setShowJobForm(!showJobForm)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        {showJobForm ? 'Cancel' : 'Create New Job'}
      </button>
      {showJobForm && <JobForm onSubmit={handleCreateJob} handleShouldUpdateJobs={handleShouldUpdateJobs} />}
      <ActiveJobsList handleShouldUpdateJobs={handleShouldUpdateJobs} />
    </div>
  );
};

export default ManagerDashboardPage;
