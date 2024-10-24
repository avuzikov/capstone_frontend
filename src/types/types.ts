// src\types\types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'applicant' | 'hiring-manager' | 'admin';
  address?: string;
  phone?: string;
  resume?: string;
  department?: string;
}

export interface Job {
  id: number;
  userId: number;
  department: string;
  listingTitle: string;
  dateListed: string;
  dateClosed?: string;
  jobTitle: string;
  jobDescription: string;
  additionalInformation?: string;
  listingStatus: 'open' | 'closed';
  experienceLevel: string;
  modelResume?: string;
  modelCoverLetter?: string;
}

export interface Application {
  id: number;
  candidateId: number;
  jobId: number;
  candidateEmail: string;
  dateApplied: string;
  coverLetter: string;
  customResume: string;
  yearsOfExperience: number;
  applicationStatus: 'pending' | 'reviewed' | 'rejected' | 'accepted';
}
