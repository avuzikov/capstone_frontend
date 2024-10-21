// src\mocks\mockData.ts
import { User, Job, Application } from '../../types/types';

export let users: User[] = [
  {
    id: 1,
    fullName: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'applicant',
    address: '123 Main St, Anytown, USA',
    phone: '555-123-4567',
  },
  {
    id: 2,
    fullName: 'Jane Smith',
    email: 'jane@example.com',
    password: 'manager456',
    role: 'hiring-manager',
    department: 'Engineering',
  },
  {
    id: 3,
    fullName: 'Admin User',
    email: 'admin@example.com',
    password: 'admin789',
    role: 'admin',
  },
  {
    id: 4,
    fullName: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'alice123',
    role: 'applicant',
    address: '456 Elm St, Othertown, USA',
    phone: '555-987-6543',
  },
  {
    id: 5,
    fullName: 'Bob Williams',
    email: 'bob@example.com',
    password: 'bob456',
    role: 'hiring-manager',
    department: 'Marketing',
  },
];

export let jobs: Job[] = [
  {
    id: 1,
    userId: 2,
    listingTitle: 'Senior Software Engineer',
    department: 'Engineering',
    listingStatus: 'open',
    dateListed: new Date('2023-05-01').toISOString(),
    jobTitle: 'Senior Software Engineer',
    jobDescription: 'We are looking for an experienced software engineer to join our team...',
    experienceLevel: '5+ years',
    additionalInformation: 'Knowledge of React and Node.js is a plus.',
  },
  {
    id: 2,
    userId: 2,
    listingTitle: 'Product Manager',
    department: 'Product',
    listingStatus: 'open',
    dateListed: new Date('2023-05-15').toISOString(),
    jobTitle: 'Senior Product Manager',
    jobDescription:
      'We are seeking a talented product manager to lead our product development efforts...',
    experienceLevel: '3-5 years',
    additionalInformation: 'Experience in agile methodologies is required.',
  },
  {
    id: 3,
    userId: 5,
    listingTitle: 'Marketing Specialist',
    department: 'Marketing',
    listingStatus: 'open',
    dateListed: new Date('2023-06-01').toISOString(),
    jobTitle: 'Marketing Specialist',
    jobDescription:
      'We are looking for a creative marketing specialist to join our growing team...',
    experienceLevel: '2-4 years',
    additionalInformation: 'Experience with social media marketing is a must.',
  },
  {
    id: 4,
    userId: 2,
    listingTitle: 'Junior Developer',
    department: 'Engineering',
    listingStatus: 'closed',
    dateListed: new Date('2023-04-01').toISOString(),
    dateClosed: new Date('2023-05-31').toISOString(),
    jobTitle: 'Junior Software Developer',
    jobDescription: 'We are seeking a passionate junior developer to join our engineering team...',
    experienceLevel: '0-2 years',
    additionalInformation: 'Recent graduates are encouraged to apply.',
  },
];

export let applications: Application[] = [
  {
    id: 1,
    userId: 1,
    jobId: 1,
    dateApplied: new Date('2023-05-05').toISOString(),
    applicationStatus: 'pending',
    coverLetter: 'I am excited to apply for this position...',
    customResume: 'John Doe\nSoftware Engineer\n5 years of experience in web development...',
  },
  {
    id: 2,
    userId: 4,
    jobId: 2,
    dateApplied: new Date('2023-05-20').toISOString(),
    applicationStatus: 'reviewed',
    coverLetter: 'As an experienced product manager, I am thrilled to apply for this role...',
    customResume: 'Alice Johnson\nProduct Manager\n4 years of experience in product development...',
  },
  {
    id: 3,
    userId: 1,
    jobId: 3,
    dateApplied: new Date('2023-06-05').toISOString(),
    applicationStatus: 'pending',
    coverLetter: 'I believe my skills in marketing would be a great fit for this position...',
    customResume: 'John Doe\nMarketing Enthusiast\n2 years of experience in digital marketing...',
  },
];

// Helper functions to modify the data
export const addUser = (user: User) => {
  users.push(user);
};

export const updateUser = (id: number, updatedUser: Partial<User>) => {
  users = users.map(u => (u.id === id ? { ...u, ...updatedUser } : u));
};

export const deleteUser = (id: number) => {
  users = users.filter(u => u.id !== id);
};

export const addJob = (job: Job) => {
  jobs.push(job);
};

export const updateJob = (id: number, updatedJob: Partial<Job>) => {
  jobs = jobs.map(j => (j.id === id ? { ...j, ...updatedJob } : j));
};

export const deleteJob = (id: number) => {
  jobs = jobs.filter(j => j.id !== id);
};

export const addApplication = (application: Application) => {
  applications.push(application);
};

export const updateApplication = (id: number, updatedApplication: Partial<Application>) => {
  applications = applications.map(a => (a.id === id ? { ...a, ...updatedApplication } : a));
};

export const deleteApplication = (id: number) => {
  applications = applications.filter(a => a.id !== id);
};
