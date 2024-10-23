// src/mocks/handlers/jobHandlers.ts

import { http, HttpResponse } from 'msw';
import { User, Job, Application } from '../../types/types';
import {
  users,
  jobs,
  applications,
  addJob,
  updateJob,
  deleteJob,
  addApplication,
  updateApplication,
  deleteApplication,
} from '../mockData';

// Utility functions
const authenticateUser = (request: Request): User | null => {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) return null;
  return users.find(user => user.id.toString() === token) || null;
};

const safeParseInt = (value: string | null, defaultValue: number): number => {
  if (value === null) return defaultValue;
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const jobHandlers = [
  // Jobs Pagination
  http.get('http://localhost:7000/api/job/page', ({ request }) => {
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 0);
    const items = safeParseInt(url.searchParams.get('items'), 20);

    const startIndex = page * items;
    const paginatedJobs = jobs.slice(startIndex, startIndex + items);
    const totalElements = jobs.length;
    const totalPages = Math.ceil(totalElements / items);

    return HttpResponse.json({
      content: paginatedJobs,
      pageable: {
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        pageNumber: page,
        pageSize: items,
        offset: startIndex,
        paged: true,
        unpaged: false,
      },
      totalPages,
      totalElements,
      last: page >= totalPages - 1,
      size: items,
      number: page,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      numberOfElements: paginatedJobs.length,
      first: page === 0,
      empty: paginatedJobs.length === 0,
    });
  }),

  // Get Job by ID
  http.get('http://localhost:7000/api/job/:id', ({ params }) => {
    const { id } = params;
    const job = jobs.find(j => j.id === parseInt(id as string));

    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    return HttpResponse.json(job);
  }),

  // Create Job
  http.post('http://localhost:7000/api/job', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const jobData = await request.json();
    const newJob: Job = {
      ...jobData,
      id: jobs.length + 1,
      userId: user.id,
      dateListed: new Date().toISOString(),
    };

    addJob(newJob);
    return HttpResponse.json(newJob);
  }),

  // Update Job
  http.put('http://localhost:7000/api/job/:id', async ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;
    const job = jobs.find(j => j.id === parseInt(id as string));

    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedData = await request.json();
    const updatedJob: Job = {
      ...job,
      ...updatedData,
      id: job.id,
      userId: job.userId,
      dateListed: job.dateListed,
    };

    updateJob(parseInt(id as string), updatedJob);
    return HttpResponse.json(updatedJob);
  }),

  // Transfer Job
  http.put('http://localhost:7000/api/job/transfer', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { jobId, fromUserId, toUserId } = await request.json();
    const job = jobs.find(j => j.id === jobId && j.userId === fromUserId);
    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    updateJob(jobId, { ...job, userId: toUserId });
    return HttpResponse.json(jobs.find(j => j.id === jobId));
  }),

  // Delete Job
  http.delete('http://localhost:7000/api/job/:id', ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;
    const job = jobs.find(j => j.id === parseInt(id as string));

    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    deleteJob(parseInt(id as string));
    return new HttpResponse(null, { status: 204 });
  }),

  // Applications Section

  // Create Application
  http.post('http://localhost:7000/api/application', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'applicant') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const applicationData = await request.json();
    const newApplication: Application = {
      ...applicationData,
      id: applications.length + 1,
      userId: user.id,
      dateApplied: new Date().toISOString(),
      applicationStatus: 'pending',
    };

    addApplication(newApplication);
    return HttpResponse.json(newApplication);
  }),

  // Get Application by ID
  http.get('http://localhost:7000/api/application/:id', ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;
    const application = applications.find(a => a.id === parseInt(id as string));

    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    if (!user || (user.role === 'applicant' && application.userId !== user.id)) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    return HttpResponse.json(application);
  }),

  // Update Application Status (Manager)
  http.put('http://localhost:7000/api/application/manager/:id', async ({ request, params }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const { applicationStatus } = await request.json();

    const application = applications.find(a => a.id === parseInt(id as string));
    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    const job = jobs.find(j => j.id === application.jobId);
    if (!job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedApplication = { ...application, applicationStatus };
    updateApplication(parseInt(id as string), updatedApplication);
    return HttpResponse.json(updatedApplication);
  }),

  // Get Applications for Job
  http.get('http://localhost:7000/api/job/:id/applications', ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;

    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const job = jobs.find(j => j.id === parseInt(id as string) && j.userId === user.id);
    if (!job) {
      return HttpResponse.json({ message: 'Job not found or not owned by you' }, { status: 404 });
    }

    const jobApplications = applications.filter(app => app.jobId === parseInt(id as string));
    return HttpResponse.json(jobApplications);
  }),

  // Manager Statistics
  http.get('http://localhost:7000/api/stats/manager', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const managerJobs = jobs.filter(job => job.userId === user.id);
    const jobApplications = applications.filter(app =>
      managerJobs.some(job => job.id === app.jobId)
    );

    return HttpResponse.json({
      totalJobs: managerJobs.length,
      openJobs: managerJobs.filter(job => job.listingStatus === 'open').length,
      closedJobs: managerJobs.filter(job => job.listingStatus === 'closed').length,
      totalApplications: jobApplications.length,
      pendingApplications: jobApplications.filter(app => app.applicationStatus === 'pending')
        .length,
      reviewedApplications: jobApplications.filter(app => app.applicationStatus === 'reviewed')
        .length,
      acceptedApplications: jobApplications.filter(app => app.applicationStatus === 'accepted')
        .length,
      rejectedApplications: jobApplications.filter(app => app.applicationStatus === 'rejected')
        .length,
    });
  }),

  // Job Filter
  http.get('http://localhost:7000/api/job/:id/filter=:filter', ({ params }) => {
    const { id, filter } = params;
    const jobApplications = applications.filter(app => app.jobId === parseInt(id as string));

    let filteredApplications = [...jobApplications];

    switch (filter) {
      case 'pending':
        filteredApplications = jobApplications.filter(app => app.applicationStatus === 'pending');
        break;
      case 'reviewed':
        filteredApplications = jobApplications.filter(app => app.applicationStatus === 'reviewed');
        break;
      case 'accepted':
        filteredApplications = jobApplications.filter(app => app.applicationStatus === 'accepted');
        break;
      case 'rejected':
        filteredApplications = jobApplications.filter(app => app.applicationStatus === 'rejected');
        break;
    }

    return HttpResponse.json(filteredApplications);
  }),

  // Manager Jobs
  http.get('http://localhost:7000/api/job/manager', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 0);
    const items = safeParseInt(url.searchParams.get('items'), 20);

    const managerJobs = jobs.filter(job => job.userId === user.id);
    const startIndex = page * items;
    const endIndex = startIndex + items;
    const paginatedJobs = managerJobs.slice(startIndex, endIndex);

    return HttpResponse.json({
      content: paginatedJobs.map(job => ({
        ...job,
        applicantCount: applications.filter(app => app.jobId === job.id).length,
      })),
      pageable: {
        sort: {
          sorted: true,
          unsorted: false,
          empty: false,
        },
        pageNumber: page,
        pageSize: items,
        offset: startIndex,
        paged: true,
        unpaged: false,
      },
      totalPages: Math.ceil(managerJobs.length / items),
      totalElements: managerJobs.length,
      last: startIndex + items >= managerJobs.length,
      size: items,
      number: page,
      sort: {
        sorted: true,
        unsorted: false,
        empty: false,
      },
      numberOfElements: paginatedJobs.length,
      first: page === 0,
      empty: paginatedJobs.length === 0,
    });
  }),

  // Application Statistics
  http.get('http://localhost:7000/api/application/:id/statistics', ({ request, params }) => {
    const user = authenticateUser(request);
    const { id } = params;

    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const application = applications.find(a => a.id === parseInt(id as string));
    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 });
    }

    return HttpResponse.json({
      ...application,
      yearsOfExperience: Math.floor(Math.random() * 10) + 1,
      matchJobDescriptionScore: Math.floor(Math.random() * 100),
      pastExperienceScore: Math.floor(Math.random() * 100),
      motivationScore: Math.floor(Math.random() * 100),
      academicAchievementScore: Math.floor(Math.random() * 100),
      pedigreeScore: Math.floor(Math.random() * 100),
      trajectoryScore: Math.floor(Math.random() * 100),
      extenuatingCircumstancesScore: Math.floor(Math.random() * 100),
      averageScore: '85',
      review: 'Good candidate with strong potential',
    });
  }),
];
