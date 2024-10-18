import { User, Job, Application } from './types';

export const users: User[] = [
  { id: 1, fullName: 'John Doe', email: 'john@example.com', role: 'applicant' },
  { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', role: 'hiring-manager' },
  { id: 3, fullName: 'Admin User', email: 'admin@example.com', role: 'admin' },
];

export const jobs: Job[] = [
  { 
    id: 1, 
    userId: 2, 
    listingTitle: 'Software Engineer', 
    department: 'Engineering', 
    listingStatus: 'open',
    dateListed: new Date().toISOString(),
    jobTitle: 'Senior Software Engineer',
    jobDescription: 'We are looking for an experienced software engineer...',
    experienceLevel: '5+ years'
  },
  { 
    id: 2, 
    userId: 2, 
    listingTitle: 'Product Manager', 
    department: 'Product', 
    listingStatus: 'open',
    dateListed: new Date().toISOString(),
    jobTitle: 'Senior Product Manager',
    jobDescription: 'We are seeking a talented product manager...',
    experienceLevel: '3-5 years'
  },
];

export const applications: Application[] = [
  { 
    id: 1, 
    userId: 1, 
    jobId: 1, 
    dateApplied: new Date().toISOString(), 
    applicationStatus: 'pending',
    coverLetter: 'I am excited to apply for this position...',
    customResume: 'My resume content goes here...'
  },
];