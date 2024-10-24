// src\types\Application.ts

import { JobDetailsType } from './Job';

export interface ApplicationDetailsType {
  id: number;
  candidateId: number;
  candidateEmail: string;
  job: JobDetailsType;
  dateApplied: string;
  customResume: string;
  coverLetter: string;
  applicationStatus: 'pending' | 'reviewed' | 'rejected' | 'accepted';
  yearsOfExperience: number;
}

export interface UpdateApplicationType {
  candidateId: number;
  candidateEmail: string;
  jobId: number;
  coverLetter: string;
  customResume: string;
  applicationStatus: string;
  yearsOfExperience: number;
}
