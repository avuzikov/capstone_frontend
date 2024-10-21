import { http, HttpResponse } from 'msw'
import { User, Job, Application } from './types'

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
  modelResume?: string;
  modelCoverLetter?: string;
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

// Mock data
let users: User[] = [
  { id: 1, fullName: 'John Doe', email: 'john@example.com', role: 'applicant' },
  { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', role: 'hiring-manager' },
  { id: 3, fullName: 'Admin User', email: 'admin@example.com', role: 'admin' },
]

let jobs: Job[] = [
  { 
    id: 1, 
    userId: 2, 
    department: 'Engineering',
    listingTitle: 'Senior Software Engineer', 
    dateListed: new Date().toISOString(),
    jobTitle: 'Senior Software Engineer',
    jobDescription: 'We are looking for an experienced software engineer...',
    listingStatus: 'open',
    experienceLevel: '5+ years'
  },
  { 
    id: 2, 
    userId: 2, 
    department: 'Product',
    listingTitle: 'Product Manager', 
    dateListed: new Date().toISOString(),
    jobTitle: 'Senior Product Manager',
    jobDescription: 'We are seeking a talented product manager...',
    listingStatus: 'open',
    experienceLevel: '3-5 years'
  },
]

let applications: Application[] = [
  { 
    id: 1, 
    userId: 1, 
    jobId: 1, 
    dateApplied: new Date().toISOString(), 
    applicationStatus: 'pending',
    coverLetter: 'I am excited to apply for this position...',
    customResume: 'My resume content goes here...'
  },
  { 
    id: 2, 
    userId: 2, 
    jobId: 2, 
    dateApplied: new Date().toISOString(), 
    applicationStatus: 'reviewed',
    coverLetter: 'I believe my skills are a perfect match for this role...',
    customResume: 'Detailed resume content for user 2...'
  },
  { 
    id: 3, 
    userId: 3, 
    jobId: 3, 
    dateApplied: new Date().toISOString(), 
    applicationStatus: 'accepted',
    coverLetter: 'I am very interested in this job opportunity...',
    customResume: 'Resume content for user 3...'
  },
  { 
    id: 4, 
    userId: 4, 
    jobId: 4, 
    dateApplied: new Date().toISOString(), 
    applicationStatus: 'rejected',
    coverLetter: 'I have the experience and skills required for this job...',
    customResume: 'Resume content for user 4...'
  },
  { 
    id: 5, 
    userId: 5, 
    jobId: 5, 
    dateApplied: new Date().toISOString(), 
    applicationStatus: 'pending',
    coverLetter: 'I am eager to bring my expertise to your team...',
    customResume: 'Resume content for user 5...'
  }
];

// Updated utility function
const authenticateUser = (request: Request): User | null => {
  const token = request.headers.get('Authorization')?.split(' ')[1]
  if (!token) {
    return null
  }
  const user = users.find(user => user.id === parseInt(token))
  return user || null
}

export const handlers = [
  // Authentication
  http.post<never, LoginRequest>('/users/login', async ({ request }) => {
    const { email, password } = await request.json()
    const user = users.find(u => u.email === email)
    if (user && password === 'password') { // simplified password check
      return HttpResponse.json(
        { message: 'Login successful' },
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
    const newUser: User = { id: users.length + 1, fullName: name, email, role: 'applicant' }
    users.push(newUser)
    return HttpResponse.json(
      { message: 'User registered successfully' },
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
    const newUser: User = { id: users.length + 1, fullName: name, email, role: 'hiring-manager' }
    users.push(newUser)
    return HttpResponse.json(newUser, { status: 200 })
  }),

  http.get<{ id: string }>('/users/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    if (!user || (user.id !== parseInt(id) && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const foundUser = users.find(u => u.id === parseInt(id))
    if (!foundUser) {
      return HttpResponse.json({ message: 'User not found' }, { status: 404 })
    }
    return HttpResponse.json(foundUser)
  }),

  http.put<{ id: string }>('/users/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    if (!user || user.id !== parseInt(id)) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const updatedData = await request.json() as Partial<User>
    const updatedUser = { ...user, ...updatedData }
    users = users.map(u => u.id === parseInt(id) ? updatedUser : u)
    return HttpResponse.json(updatedUser)
  }),

  http.delete<{ id: string }>('/users/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    if (!user || (user.id !== parseInt(id) && user.role !== 'admin')) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    users = users.filter(u => u.id !== parseInt(id))
    return HttpResponse.json(null, { status: 204 })
  }),

  // Jobs
  http.get<{ id: string }>('/api/job/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { id } = params
    const job = jobs.find(j => j.id === parseInt(id))
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
      id: jobs.length + 1, 
      ...jobData, 
      userId: user.id,
      dateListed: new Date().toISOString()
    }
    jobs.push(newJob)
    return HttpResponse.json(newJob)
  }),

  http.put<{ id: string }, JobRequest>('/api/job/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const job = jobs.find(j => j.id === parseInt(id))
    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const updatedData = await request.json()
    const updatedJob = { ...job, ...updatedData }
    jobs = jobs.map(j => j.id === parseInt(id) ? updatedJob : j)
    return HttpResponse.json(updatedJob)
  }),

  http.put<never, JobTransferRequest>('/api/job/transfer', async ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'admin') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { jobId, fromUserId, toUserId } = await request.json()
    const job = jobs.find(j => j.id === jobId && j.userId === fromUserId)
    if (!job) {
      return HttpResponse.json({ message: 'Job not found' }, { status: 404 })
    }
    const updatedJob = { ...job, userId: toUserId }
    jobs = jobs.map(j => j.id === jobId ? updatedJob : j)
    return HttpResponse.json(updatedJob)
  }),

  http.delete<{ id: string }>('/api/job/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const job = jobs.find(j => j.id === parseInt(id))
    if (!user || user.role !== 'hiring-manager' || !job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    jobs = jobs.filter(j => j.id !== parseInt(id))
    return HttpResponse.json(null, { status: 204 })
  }),

 
  http.get<{ page: string, items: string }>('/api/job', ({ params, request }) => {
    const user = authenticateUser(request)
    if (!user) {
      return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    }
    const { page, items } = params
    const pageSize = parseInt(items) || 20
    const startIndex = (parseInt(page) - 1) * pageSize
    const endIndex = startIndex + pageSize
    const paginatedJobs = jobs.slice(startIndex, endIndex)
    return HttpResponse.json(paginatedJobs)
  }),

  // Applications
  http.post<never, ApplicationRequest>('/api/application', async ({ request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'applicant') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const applicationData = await request.json()
    const newApplication: Application = { 
      id: applications.length + 1, 
      ...applicationData, 
      userId: user.id,
      dateApplied: new Date().toISOString(),
      applicationStatus: 'pending'
    }
    applications.push(newApplication)
    return HttpResponse.json(newApplication)
  }),

  //TODO: Set up for authorized users
  http.get('/api/application', ({ request }) => 
  {
    const user = authenticateUser(request)
    // if (!user) {
    //   return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 })
    // }
    return HttpResponse.json(applications);
  }),

  http.get<{ id: string }>('/api/application/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const application = applications.find(a => a.id === parseInt(id))
    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 })
    }
    // if (!user || (user.role === 'applicant' && application.userId !== user.id)) {
    //   return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    // }
    return HttpResponse.json(application)
  }),

  http.put<{ id: string }, Partial<ApplicationRequest>>('/api/application/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const application = applications.find(a => a.id === parseInt(id))
    if (!user || user.role !== 'applicant' || !application || application.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const updatedData = await request.json()
    const updatedApplication = { ...application, ...updatedData }
    applications = applications.map(a => a.id === parseInt(id) ? updatedApplication : a)
    return HttpResponse.json(updatedApplication)
  }),

  http.put<{ id: string }, ApplicationStatusUpdateRequest>('/api/application/manager/:id', async ({ params, request }) => {
    const user = authenticateUser(request)
    if (!user || user.role !== 'hiring-manager') {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { id } = params
    const application = applications.find(a => a.id === parseInt(id))
    if (!application) {
      return HttpResponse.json({ message: 'Application not found' }, { status: 404 })
    }
    const job = jobs.find(j => j.id === application.jobId)
    if (!job || job.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    const { applicationStatus } = await request.json()
    const updatedApplication = { ...application, applicationStatus }
    applications = applications.map(a => a.id === parseInt(id) ? updatedApplication : a)
    return HttpResponse.json(updatedApplication)
  }),

  http.delete<{ id: string }>('/api/application/:id', ({ params, request }) => {
    const user = authenticateUser(request)
    const { id } = params
    const application = applications.find(a => a.id === parseInt(id))
    if (!user || user.role !== 'applicant' || !application || application.userId !== user.id) {
      return HttpResponse.json({ message: 'Forbidden' }, { status: 403 })
    }
    applications = applications.filter(a => a.id !== parseInt(id))
    return HttpResponse.json(null, { status: 204 })
  }),
]