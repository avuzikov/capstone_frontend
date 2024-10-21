import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import JobForm from '../../components/manager/JobForm';
import ApplicantList from '../../components/manager/ApplicantList';
import ApplicantStatusUpdate from '../../components/manager/ApplicantStatusUpdate';
import ApplicantSortOptions from '../../components/manager/ApplicantSortOptions';
import { jobs, applications, users, updateJob, updateApplication } from '../../mocks/mockData';
import { Job, Application, User } from '../../mocks/types';

type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted' | 'undefined'

const JobManagementPage: React.FC = () => {
    const { jobId } = useParams<{ jobId: string }>();
    const [job, setJob] = useState(jobs.find(j => j.id === parseInt(jobId || '')));
    const [applicants, setApplicants] = useState<Application[]>([]);
    const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
    const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'> ('all');
    const [isEditing, setIsEditing] = useState<boolean>(false);

    useEffect(() => {
        const foundJob = jobs.find(j => j.id === parseInt(jobId || '0'));
        if (foundJob) {
            setJob(foundJob as Job);
            const jobApplicants = applications
                .filter(app => app.jobId === foundJob.id)
                .map(app => ({
                    ...app,
                    user: users.find(u => u.id === app.userId)
                }));
            setApplicants(jobApplicants as Application[]);
        }
    }, [jobId]);

    if (!job) {
        return <div>Job not found</div>;
    }

    const handleUpdateJob = (updatedJobData: Partial<Job>) => {
        updateJob(job.id, updatedJobData);
        setJob({ ...job, ...updatedJobData });
        setIsEditing(false);
    };

    const handleStatusChange = (applicantId: number, newStatus: ApplicationStatus) => {
        setApplicants(prevApplicants =>
            prevApplicants.map(app =>
                app.id === applicantId ? { ...app, applicationStatus: newStatus } : app
            )
        );
    };

    const sortedAndFilteredApplicants = applicants
        .filter(app => filterStatus === 'all' || app.applicationStatus === filterStatus)
        .sort((a, b) => {
            if (sortBy === 'date') {
                return new Date(b.dateApplied).getTime() - new Date(a.dateApplied).getTime();
            } else {
                return a.applicationStatus.localeCompare(b.applicationStatus);
            }
        });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Job Management</h1>
            {isEditing ? (
                <JobForm initialJob={job} onSubmit={handleUpdateJob} />
            ) : (
                <div className="mb-6">
                    <h2 className="text-2xl font-semibold">{job.listingTitle}</h2>
                    <p><strong>Department:</strong> {job.department}</p>
                    <p><strong>Status:</strong> {job.listingStatus}</p>
                    <p><strong>Job Description:</strong> {job.jobDescription}</p>
                    <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                    >
                        Edit Job
                    </button>
                </div>
            )}
            <h2 className="text-2xl font-semibold mb-4">Applicants</h2>
            <ApplicantSortOptions
                sortBy={sortBy}
                filterStatus={filterStatus}
                onSortChange={setSortBy}
                onFilterChange={setFilterStatus}
            />
            <ApplicantList
                applicants={sortedAndFilteredApplicants}
                onStatusChange={handleStatusChange}
            />
        </div>
    );
};

export default JobManagementPage;