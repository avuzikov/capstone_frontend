import { http, HttpResponse } from 'msw'
import { User, Job, Application } from './types'
import * as db from './db.ts'

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
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return null
  }
  const user = db.getUserById(parseInt(token))
  return user || null
}

// Helper function to safely parse query parameters
const safeParseInt = (value: string | null, defaultValue: number): number => {
  if (value === null) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

export const handlers = [
  // Authentication
  http.post<never, LoginRequest>('/users/login', async ({ request }) => {
    const { email, password } = await request.json()
    const user = db.getUsers().find(u => u.email === email && u.password === password)
    if (user) {
      return HttpResponse.json(
        { message: 'Login successful', token: user.id.toString(), role: user.role },
        {
          status: 200,
          headers: {
            'Authorization': `Bearer ${user.id}`
          }
        }
      )
    }
    return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 })
  }),

  // Users
  http.post<never, RegistrationRequest>('/users/registration', async ({ request }) => {
    const { email, password, name } = await request.json()
    const newUser: User = { id: db.getNextUserId(), fullName: name, email, password, role: 'applicant' }
    db.addUser(newUser)
    return HttpResponse.json(
      { message: 'User registered successfully', token: newUser.id.toString(), role: newUser.role },
      {
        status: 200,
        headers: {
          'Authorization': `Bearer ${newUser.id}`
        }
      }
    )
  }),

  http.post<never, RegistrationRequest>('/users/registration/admin', async ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { email, password, name } = await request.json()
    const newUser: User = { id: db.getNextUserId(), fullName: name, email, password, role: 'hiring-manager' }
    db.addUser(newUser)
    return HttpResponse.json(newUser, { status: 200 })
  }),

  http.get<{ id: string }>('/users/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    if (!user || (user.id !== parseInt(id) && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const foundUser = db.getUserById(parseInt(id))
    if (!foundUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const { password, ...userWithoutPassword } = foundUser
    return HttpResponse.json(userWithoutPassword)
  }),

  http.put<{ id: string }>('/users/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    if (!user || user.id !== parseInt(id)) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const updatedData = await request.json() as Partial<User>
    db.updateUser(parseInt(id), updatedData)
    const updatedUser = db.getUserById(parseInt(id))
    if (!updatedUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    const { password, ...userWithoutPassword } = updatedUser
    return HttpResponse.json(userWithoutPassword)
  }),

  http.delete<{ id: string }>('/users/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    if (!user || (user.id !== parseInt(id) && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    db.deleteUser(parseInt(id))
    return HttpResponse.json(null, { status: 204 })
  }),

  // Jobs
  http.get<{ id: string }>('/api/job/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { id } = params
    const job = db.getJobById(parseInt(id))
    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 })
    }
    return HttpResponse.json(job)
  }),

  http.post<never, JobRequest>('/api/job', async ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const jobData = await request.json()
    const newJob: Job = { 
      id: db.getNextJobId(), 
      ...jobData, 
      userId: user.id,
      dateListed: new Date().toISOString()
    }
    db.addJob(newJob)
    return HttpResponse.json(newJob)
  }),

  http.put<{ id: string }, JobRequest>('/api/job/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const job = db.getJobById(parseInt(id))
    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const updatedData = await request.json()
    db.updateJob(parseInt(id), updatedData)
    const updatedJob = db.getJobById(parseInt(id))
    return HttpResponse.json(updatedJob)
  }),

  http.put<never, JobTransferRequest>('/api/job/transfer', async ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { jobId, fromUserId, toUserId } = await request.json()
    const job = db.getJobById(jobId)
    if (!job || job.userId !== fromUserId) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 })
    }
    db.updateJob(jobId, { userId: toUserId })
    const updatedJob = db.getJobById(jobId)
    return HttpResponse.json(updatedJob)
  }),

  http.delete<{ id: string }>('/api/job/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const job = db.getJobById(parseInt(id))
    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    db.deleteJob(parseInt(id))
    return HttpResponse.json(null, { status: 204 })
  }),

  http.get('/api/job', ({ request }) => {
    const user = authenticateUser(request)
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const url = new URL(request.url)
    const page = safeParseInt(url.searchParams.get('page'), 1)
    const items = safeParseInt(url.searchParams.get('items'), 20)
    const allJobs = db.getJobs()
    const startIndex = (page - 1) * items
    const endIndex = startIndex + items
    const paginatedJobs = allJobs.slice(startIndex, endIndex)
    return HttpResponse.json({
      total: allJobs.length,
      page,
      items,
      jobs: paginatedJobs
    })
  }),

  // Applications
  http.post<never, ApplicationRequest>('/api/application', async ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'applicant') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const applicationData = await request.json()
    const newApplication: Application = { 
      id: db.getNextApplicationId(), 
      ...applicationData, 
      userId: user.id,
      dateApplied: new Date().toISOString(),
      applicationStatus: 'pending'
    }
    db.addApplication(newApplication)
    return HttpResponse.json(newApplication)
  }),

  http.get<{ id: string }>('/api/application/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const application = db.getApplicationById(parseInt(id))
    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 })
    }
    if (!user || (user.role === 'applicant' && application.userId !== user.id)) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    return HttpResponse.json(application)
  }),

  http.put<{ id: string }, Partial<ApplicationRequest>>('/api/application/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const application = db.getApplicationById(parseInt(id))
    if (!user || user.role !== 'applicant' || !application || application.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const updatedData = await request.json()
    db.updateApplication(parseInt(id), updatedData)
    const updatedApplication = db.getApplicationById(parseInt(id))
    return HttpResponse.json(updatedApplication)
  }),

  http.put<{ id: string }, ApplicationStatusUpdateRequest>('/api/application/manager/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { id } = params
    const application = db.getApplicationById(parseInt(id))
    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 })
    }
    const job = db.getJobById(application.jobId)
    if (!job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { applicationStatus } = await request.json()
    db.updateApplication(parseInt(id), { applicationStatus })
    const updatedApplication = db.getApplicationById(parseInt(id))
    return HttpResponse.json(updatedApplication)
  }),

  http.delete<{ id: string }>('/api/application/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const application = db.getApplicationById(parseInt(id))
    if (!user || user.role !== 'applicant' || !application || application.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    db.deleteApplication(parseInt(id))
    return HttpResponse.json(null, { status: 204 })
  }),

  // Manager-specific routes
  http.get('/api/job/manager', ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const url = new URL(request.url)
    const page = safeParseInt(url.searchParams.get('page'), 1)
    const items = safeParseInt(url.searchParams.get('items'), 20)
    const managerJobs = db.getJobsCreatedByUser(user.id)
    const startIndex = (page - 1) * items
    const endIndex = startIndex + items
    const paginatedJobs = managerJobs.slice(startIndex, endIndex)
    return HttpResponse.json({
      total: managerJobs.length,
      page,
      items,
      jobs: paginatedJobs.map(job => ({
        ...job,
        applicantCount: db.getApplicationsByJobId(job.id).length
      }))
    })
  }),

  http.get<{ jobId: string }>('/api/application/job/:jobId', ({ params, request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { jobId } = params
    const job = db.getJobById(parseInt(jobId))
    if (!job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Job not found or not owned by you' }, { status: 404 })
    }
    const url = new URL(request.url)
    const page = safeParseInt(url.searchParams.get('page'), 1)
    const items = safeParseInt(url.searchParams.get('items'), 20)
    const jobApplications = db.getApplicationsByJobId(parseInt(jobId))
    const startIndex = (page - 1) * items
    const endIndex = startIndex + items
    const paginatedApplications = jobApplications.slice(startIndex, endIndex)
    return HttpResponse.json({
      total: jobApplications.length,
      page,
      items,
      applications: paginatedApplications.map(app => ({
        ...app,
        applicantName: db.getUserById(app.userId)?.fullName
      }))
    })
  }),

  http.get('/api/user/manager/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    
    const { id } = params
    
    if (typeof id !== 'string') {
      return HttpResponse.json({ message: 'Invalid ID format' }, { status: 400 })
    }
    
    const managerId = parseInt(id, 10)
    
    if (isNaN(managerId)) {
      return HttpResponse.json({ message: 'Invalid ID format' }, { status: 400 })
    }
    
    const manager = db.getUserById(managerId)
    
    if (!manager || manager.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Manager not found' }, { status: 404 })
    }
    
    return HttpResponse.json({
      id: manager.id,
      fullName: manager.fullName,
      department: manager.department,
      jobTitle: 'Hiring Manager',
      publicContactInfo: manager.email
    })
  }),

  // Admin routes
  http.get('/api/admin/users', ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const url = new URL(request.url)
    const page = safeParseInt(url.searchParams.get('page'), 1)
    const items = safeParseInt(url.searchParams.get('items'), 20)
    const allUsers = db.getUsers()
    const startIndex = (page - 1) * items
    const endIndex = startIndex + items
    const paginatedUsers = allUsers.slice(startIndex, endIndex)
    return HttpResponse.json({
      total: allUsers.length,
      page,
      items,
      users: paginatedUsers.map(({ password, ...user }) => user)
    })
  }),

  http.get('/api/admin/jobs', ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const url = new URL(request.url)
    const page = safeParseInt(url.searchParams.get('page'), 1)
    const items = safeParseInt(url.searchParams.get('items'), 20)
    const allJobs = db.getJobs()
    const startIndex = (page - 1) * items
    const endIndex = startIndex + items
    const paginatedJobs = allJobs.slice(startIndex, endIndex)
    return HttpResponse.json({
      total: allJobs.length,
      page,
      items,
      jobs: paginatedJobs.map(job => ({
        ...job,
        applicantCount: db.getApplicationsByJobId(job.id).length,
        managerName: db.getUserById(job.userId)?.fullName
      }))
    })
  }),

  http.get('/api/admin/applications', ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const url = new URL(request.url)
    const page = safeParseInt(url.searchParams.get('page'), 1)
    const items = safeParseInt(url.searchParams.get('items'), 20)
    const allApplications = db.getApplications()
    const startIndex = (page - 1) * items
    const endIndex = startIndex + items
    const paginatedApplications = allApplications.slice(startIndex, endIndex)
    return HttpResponse.json({
      total: allApplications.length,
      page,
      items,
      applications: paginatedApplications.map(app => ({
        ...app,
        applicantName: db.getUserById(app.userId)?.fullName,
        jobTitle: db.getJobById(app.jobId)?.jobTitle
      }))
    })
  }),

  // Statistics routes
  http.get('/api/stats/applicant', ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'applicant') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const userApplications = db.getApplicationsByUserId(user.id)
    return HttpResponse.json({
      totalApplications: userApplications.length,
      pendingApplications: userApplications.filter(app => app.applicationStatus === 'pending').length,
      reviewedApplications: userApplications.filter(app => app.applicationStatus === 'reviewed').length,
      acceptedApplications: userApplications.filter(app => app.applicationStatus === 'accepted').length,
      rejectedApplications: userApplications.filter(app => app.applicationStatus === 'rejected').length
    })
  }),

  http.get('/api/stats/manager', ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const managerJobs = db.getJobsCreatedByUser(user.id)
    const jobApplications = managerJobs.flatMap(job => db.getApplicationsByJobId(job.id))
    return HttpResponse.json({
      totalJobs: managerJobs.length,
      openJobs: managerJobs.filter(job => job.listingStatus === 'open').length,
      closedJobs: managerJobs.filter(job => job.listingStatus === 'closed').length,
      totalApplications: jobApplications.length,
      pendingApplications: jobApplications.filter(app => app.applicationStatus === 'pending').length,
      reviewedApplications: jobApplications.filter(app => app.applicationStatus === 'reviewed').length,
      acceptedApplications: jobApplications.filter(app => app.applicationStatus === 'accepted').length,
      rejectedApplications: jobApplications.filter(app => app.applicationStatus === 'rejected').length
    })
  }),

  http.get('/api/stats/admin', ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const allUsers = db.getUsers()
    const allJobs = db.getJobs()
    const allApplications = db.getApplications()
    return HttpResponse.json({
      totalUsers: allUsers.length,
      applicants: allUsers.filter(u => u.role === 'applicant').length,
      hiringManagers: allUsers.filter(u => u.role === 'hiring-manager').length,
      admins: allUsers.filter(u => u.role === 'admin').length,
      totalJobs: allJobs.length,
      openJobs: allJobs.filter(job => job.listingStatus === 'open').length,
      closedJobs: allJobs.filter(job => job.listingStatus === 'closed').length,
      totalApplications: allApplications.length,
      pendingApplications: allApplications.filter(app => app.applicationStatus === 'pending').length,
      reviewedApplications: allApplications.filter(app => app.applicationStatus === 'reviewed').length,
      acceptedApplications: allApplications.filter(app => app.applicationStatus === 'accepted').length,
      rejectedApplications: allApplications.filter(app => app.applicationStatus === 'rejected').length
    })
  })
]