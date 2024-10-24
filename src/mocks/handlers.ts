// src\mocks\handlers.ts

import { http, HttpResponse } from 'msw';
import { User, Job, Application } from '../types/types';
import {
  users,
  jobs,
  applications,
  addUser,
  updateUser,
  deleteUser,
  addJob,
  updateJob,
  deleteJob,
  addApplication,
  updateApplication,
  deleteApplication,
} from './mockData';
import { jwtDecode } from 'jwt-decode';

// Define interfaces for request bodies
interface LoginRequest {
  email: string;
  password: string;
}

interface RegistrationRequest {
  email: string;
  password: string;
  name: string;
}

interface JobRequest {
  department: string;
  listingTitle: string;
  jobTitle: string;
  jobDescription: string;
  listingStatus: 'open' | 'closed';
  experienceLevel: string;
  additionalInformation?: string;
}

interface JobTransferRequest {
  jobId: number;
  fromUserId: number;
  toUserId: number;
}

interface ApplicationRequest {
  jobId: number;
  coverLetter: string;
  customResume: string;
}

interface ApplicationStatusUpdateRequest {
  applicationStatus: 'pending' | 'reviewed' | 'rejected' | 'accepted';
}

// Utility function to authenticate user
const authenticateUser = (request: Request): User | null => {
  const token = request.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return null;
  }
  const user = users.find(
    user => user.id === parseInt((jwtDecode(token) as { userId: string; role: string }).userId)
  );
  return user || null;
};

// Helper function to safely parse query parameters
const safeParseInt = (value: string | null, defaultValue: number): number => {
  if (value === null) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const handlers = [
  // Authentication
  http.post<never, LoginRequest>('/users/login', async ({ request }) => {
    const { email, password } = await request.json();
    const user = users.find(u => u.email === email && u.password === password);
    let token: string;
    if (user) {
      switch (user?.id) {
        case 1:
          token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6ImFwcGxpY2FudCJ9.HA71Lz8PLwEaf8VEOwHAwX5L5sqxVQcKF-eZnEXsI40';
          break;
        case 2:
          token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyIiwicm9sZSI6ImhpcmluZy1tYW5hZ2VyIn0.-N_OpzT5chFKq8px8-FbelqHDbyzZBUhQDtN7W-kFTo';
          break;
        case 3:
          token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzIiwicm9sZSI6ImFkbWluIn0.jf4pFwho0xm_YnPV00gcSQmcJHPSysZb_xILafymyQY';
          break;
        default:
          token =
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6ImFwcGxpY2FudCJ9.HA71Lz8PLwEaf8VEOwHAwX5L5sqxVQcKF-eZnEXsI40';
      }
      return HttpResponse.json(token, {
        status: 200,
        headers: {
          Authorization: `Bearer ${user.id}`,
        },
      });
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
  }),

  // Users
  http.post<never, RegistrationRequest>('/users/registration', async ({ request }) => {
    const { email, password, name } = await request.json();
    const newUser: User = {
      id: users.length + 1,
      name: name,
      email,
      password,
      role: 'applicant',
    };
    addUser(newUser);
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxIiwicm9sZSI6ImFwcGxpY2FudCJ9.HA71Lz8PLwEaf8VEOwHAwX5L5sqxVQcKF-eZnEXsI40';
    return HttpResponse.json(JSON.stringify(token), {
      status: 200,
      headers: {
        Authorization: `Bearer ${newUser.id}`,
      },
    });
  }),

  http.get('/users', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    return HttpResponse.json(users);
  }),

  http.get<{ id: string }>('/users/managers/:id', ({ params, request }) => {
    const user = authenticateUser(request);
    if (!user) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const { id } = params;
    const managerId = parseInt(id);

    const managers = users.filter(u => u.role === 'hiring-manager');

    const manager = managers.find(u => u.id === managerId);

    if (!manager) {
      return HttpResponse.json({ message: 'Manager not found' }, { status: 404 });
    }

    // return only the manager fullName, email, and department
    return HttpResponse.json({
      id: manager.id,
      name: manager.name,
      email: manager.email,
      department: manager.department,
    });
  }),

  http.post<never, RegistrationRequest>('/users/registration/admin', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { email, password, name } = await request.json();
    const newUser: User = {
      id: users.length + 1,
      name: name,
      email,
      password,
      role: 'hiring-manager',
    };
    addUser(newUser);
    return HttpResponse.json(newUser, { status: 200 });
  }),

  http.get<{ id: string }>('/users/:id', ({ params, request }) => {
    const user = authenticateUser(request);
    const { id } = params;
    if (!user || (user.id !== parseInt(id) && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const foundUser = users.find(u => u.id === parseInt(id));
    if (!foundUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const { password, ...userWithoutPassword } = foundUser;
    return HttpResponse.json(userWithoutPassword);
  }),

  http.put<{ id: string }>('/users/:id', async ({ params, request }) => {
    const user = authenticateUser(request);
    const { id } = params;
    if (!user || (user.id !== parseInt(id) && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const updatedData = (await request.json()) as Partial<User>;
    updateUser(parseInt(id), updatedData);
    const updatedUser = users.find(u => u.id === parseInt(id));
    if (!updatedUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 });
    }
    const { password, ...userWithoutPassword } = updatedUser;
    return HttpResponse.json(userWithoutPassword);
  }),

  http.delete<{ id: string }>('/users/:id', ({ params, request }) => {
    const user = authenticateUser(request);
    const { id } = params;
    if (!user || (user.id !== parseInt(id) && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    deleteUser(parseInt(id));
    return HttpResponse.json(null, { status: 204 });
  }),

  // Manager-specific routes
  http.get('/api/job/manager', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 1);
    const items = safeParseInt(url.searchParams.get('items'), 20);
    const managerJobs = jobs.filter(job => job.userId === user.id);
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedJobs = managerJobs.slice(startIndex, endIndex);
    return HttpResponse.json({
      total: managerJobs.length,
      page,
      items,
      jobs: paginatedJobs.map(job => ({
        ...job,
        applicantCount: applications.filter(app => app.jobId === job.id).length,
      })),
    });
  }),

  http.get('/api/job/search', ({ request }) => {
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 1);
    const items = safeParseInt(url.searchParams.get('items'), 20);
    const searchQuery = url.searchParams.get('value') || '';
    const filteredJobs = jobs.filter(
      job =>
        job.jobTitle.toLowerCase().includes(searchQuery) ||
        job.listingTitle.toLowerCase().includes(searchQuery)
    );
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedJobs = filteredJobs.slice(startIndex, endIndex);
    return HttpResponse.json({
      total: filteredJobs.length,
      page,
      items,
      jobs: paginatedJobs,
    });
  }),

  // Jobs
  http.get<{ id: string }>('/api/job/:id', ({ params, request }) => {
    const { id } = params;
    const job = jobs.find(j => j.id === parseInt(id));
    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    return HttpResponse.json(job);
  }),

  http.post<never, JobRequest>('/api/job', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const jobData = await request.json();
    const newJob: Job = {
      id: jobs.length + 1,
      ...jobData,
      userId: user.id,
      dateListed: new Date().toISOString(),
    };
    addJob(newJob);
    return HttpResponse.json(newJob);
  }),

  http.put<never, JobTransferRequest>('/api/job/transfer', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { jobId, fromUserId, toUserId } = await request.json();

    const jobToTransfer = jobs.find(j => j.id === jobId);

    if (!jobToTransfer) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }

    jobToTransfer.userId = Number(toUserId);

    return HttpResponse.json(jobToTransfer);
  }),

  http.put<{ id: string }, JobRequest>('/api/job/:id', async ({ params, request }) => {
    const user = authenticateUser(request);
    const { id } = params;
    const job = jobs.find(j => j.id === parseInt(id));

    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    const updatedData: JobRequest = await request.json();

    const updatedJob: Job = {
      ...job,
      ...updatedData,
      id: job.id, // Preserve the original ID
      userId: job.userId, // Preserve the user ID
      dateListed: job.dateListed, // Preserve the original listing date
    };

    updateJob(parseInt(id), updatedJob);
    return HttpResponse.json(updatedJob);
  }),

  http.put<never, JobTransferRequest>('/api/job/transfer', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { jobId, fromUserId, toUserId } = await request.json();
    const job = jobs.find(j => j.id === jobId && j.userId === fromUserId);
    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    updateJob(jobId, { userId: toUserId });
    const updatedJob = jobs.find(j => j.id === jobId);
    return HttpResponse.json(updatedJob);
  }),

  http.delete<{ id: string }>('/api/job/:id', ({ params, request }) => {
    const user = authenticateUser(request);
    const { id } = params;
    const job = jobs.find(j => j.id === parseInt(id));
    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    deleteJob(parseInt(id));
    return HttpResponse.json(null, { status: 204 });
  }),

  http.get('/api/job', ({ request }) => {
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 1);
    const items = safeParseInt(url.searchParams.get('items'), 20);
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    return HttpResponse.json({
      total: jobs.length,
      page,
      items,
      jobs: paginatedJobs,
    });
  }),

  // Applications
  http.post<never, ApplicationRequest>('/api/application', async ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'applicant') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const applicationData = await request.json();
    const newApplication: Application = {
      id: applications.length + 1,
      ...applicationData,
      candidateId: user.id,
      dateApplied: new Date().toISOString(),
      applicationStatus: 'pending',
      candidateEmail: '',
      yearsOfExperience: 0
    };
    addApplication(newApplication);
    return HttpResponse.json(newApplication);
  }),

  //TODO: Set up for authorized users

  http.get<{ id: string }>('/api/application/:id', ({ params, request }) => {
    const user = authenticateUser(request);
    const { id } = params;
    const application = applications.find(a => a.id === parseInt(id));
    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 });
    }
    // if (!user || (user.role === 'applicant' && application.userId !== user.id)) {
    //   return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    // }
    return HttpResponse.json(application);
  }),

  http.put<{ id: string }, Partial<ApplicationRequest>>(
    '/api/application/:id',
    async ({ params, request }) => {
      const user = authenticateUser(request);
      const { id } = params;
      const application = applications.find(a => a.id === parseInt(id));
      if (
        !user ||
        user.role !== 'applicant' ||
        !application ||
        application.candidateId !== user.id
      ) {
        return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      const updatedData = await request.json();
      updateApplication(parseInt(id), updatedData);
      const updatedApplication = applications.find(a => a.id === parseInt(id));
      return HttpResponse.json(updatedApplication);
    }
  ),

  http.put<{ id: string }, ApplicationStatusUpdateRequest>(
    '/api/application/manager/:id',
    async ({ params, request }) => {
      const user = authenticateUser(request);
      if (!user || user.role !== 'hiring-manager') {
        return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      const { id } = params;
      const application = applications.find(a => a.id === parseInt(id));
      if (!application) {
        return HttpResponse.json({ message: 'Application not found' }, { status: 404 });
      }
      const job = jobs.find(j => j.id === application.jobId);
      if (!job || job.userId !== user.id) {
        return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
      }
      const { applicationStatus } = await request.json();
      updateApplication(parseInt(id), { applicationStatus });
      const updatedApplication = applications.find(a => a.id === parseInt(id));
      return HttpResponse.json(updatedApplication);
    }
  ),

  http.get('/api/application', ({ request }) => {
    const user = authenticateUser(request);
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    const page = parseInt(new URL(request.url).searchParams.get('page') || '1');
    const items = parseInt(new URL(request.url).searchParams.get('items') || '10');
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedApplications = applications.slice(startIndex, endIndex);
    return HttpResponse.json(paginatedApplications);
  }),

  http.delete<{ id: string }>('/api/application/:id', ({ params, request }) => {
    const user = authenticateUser(request);
    const { id } = params;
    const application = applications.find(a => a.id === parseInt(id));
    if (!user || user.role !== 'applicant' || !application || application.candidateId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    deleteApplication(parseInt(id));
    return HttpResponse.json(null, { status: 204 });
  }),

  // Jobs
  http.get<{ id: string }>('/api/job/:id', ({ params, request }) => {
    const { id } = params;
    const job = jobs.find(j => j.id === parseInt(id));
    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 });
    }
    return HttpResponse.json(job);
  }),

  http.get<{ jobId: string }>('/api/application/job/:jobId', ({ params, request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const { jobId } = params;
    const job = jobs.find(j => j.id === parseInt(jobId) && j.userId === user.id);
    if (!job) {
      return HttpResponse.json({ message: 'Job not found or not owned by you' }, { status: 404 });
    }
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 1);
    const items = safeParseInt(url.searchParams.get('items'), 20);
    const jobApplications = applications.filter(app => app.jobId === parseInt(jobId));
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedApplications = jobApplications.slice(startIndex, endIndex);
    return HttpResponse.json({
      total: jobApplications.length,
      page,
      items,
      applications: paginatedApplications.map(app => ({
        ...app,
        applicantName: users.find(u => u.id === app.candidateId)?.name,
      })),
    });
  }),

  http.get('/user/manager/:id', ({ params, request }) => {
    const { id } = params;

    // Type guard to ensure id is a string
    if (typeof id !== 'string') {
      return HttpResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const managerId = parseInt(id, 10);

    if (isNaN(managerId)) {
      return HttpResponse.json({ message: 'Invalid ID format' }, { status: 400 });
    }

    const manager = users.find(u => u.id === managerId && u.role === 'hiring-manager');

    if (!manager) {
      return HttpResponse.json({ message: 'Manager not found' }, { status: 404 });
    }

    return HttpResponse.json({
      id: manager.id,
      name: manager.name,
      department: manager.department,
      jobTitle: 'Hiring Manager', // Assuming all hiring managers have this title
      publicContactInfo: manager.email, // You might want to limit what information is public
    });
  }),

  // Admin routes
  http.get('/api/admin/users', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 1);
    const items = safeParseInt(url.searchParams.get('items'), 20);
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedUsers = users.slice(startIndex, endIndex);
    return HttpResponse.json({
      total: users.length,
      page,
      items,
      users: paginatedUsers.map(({ password, ...user }) => user), // Exclude password from response
    });
  }),

  http.get('/api/admin/jobs', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 1);
    const items = safeParseInt(url.searchParams.get('items'), 20);
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedJobs = jobs.slice(startIndex, endIndex);
    return HttpResponse.json({
      total: jobs.length,
      page,
      items,
      jobs: paginatedJobs.map(job => ({
        ...job,
        applicantCount: applications.filter(app => app.jobId === job.id).length,
        managerName: users.find(u => u.id === job.userId)?.name,
      })),
    });
  }),

  http.get('/api/admin/applications', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const url = new URL(request.url);
    const page = safeParseInt(url.searchParams.get('page'), 1);
    const items = safeParseInt(url.searchParams.get('items'), 20);
    const startIndex = (page - 1) * items;
    const endIndex = startIndex + items;
    const paginatedApplications = applications.slice(startIndex, endIndex);
    return HttpResponse.json({
      total: applications.length,
      page,
      items,
      applications: paginatedApplications.map(app => ({
        ...app,
        applicantName: users.find(u => u.id === app.candidateId)?.name,
        jobTitle: jobs.find(j => j.id === app.jobId)?.jobTitle,
      })),
    });
  }),

  // Statistics routes
  http.get('/api/stats/applicant', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'applicant') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    const userApplications = applications.filter(app => app.candidateId === user.id);
    return HttpResponse.json({
      totalApplications: userApplications.length,
      pendingApplications: userApplications.filter(app => app.applicationStatus === 'pending')
        .length,
      reviewedApplications: userApplications.filter(app => app.applicationStatus === 'reviewed')
        .length,
      acceptedApplications: userApplications.filter(app => app.applicationStatus === 'accepted')
        .length,
      rejectedApplications: userApplications.filter(app => app.applicationStatus === 'rejected')
        .length,
    });
  }),

  http.get('/api/stats/manager', ({ request }) => {
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

  http.get('/api/stats/admin', ({ request }) => {
    const user = authenticateUser(request);
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
    return HttpResponse.json({
      totalUsers: users.length,
      applicants: users.filter(u => u.role === 'applicant').length,
      hiringManagers: users.filter(u => u.role === 'hiring-manager').length,
      admins: users.filter(u => u.role === 'admin').length,
      totalJobs: jobs.length,
      openJobs: jobs.filter(job => job.listingStatus === 'open').length,
      closedJobs: jobs.filter(job => job.listingStatus === 'closed').length,
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.applicationStatus === 'pending').length,
      reviewedApplications: applications.filter(app => app.applicationStatus === 'reviewed').length,
      acceptedApplications: applications.filter(app => app.applicationStatus === 'accepted').length,
      rejectedApplications: applications.filter(app => app.applicationStatus === 'rejected').length,
    });
  }),
];
