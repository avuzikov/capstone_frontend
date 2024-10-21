// src\components\manager\types.ts
export interface User {
    id: number;
    fullName: string;
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
    userId: number;
    jobId: number;
    dateApplied: string;
    coverLetter: string;
    customResume: string;
    applicationStatus: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  }