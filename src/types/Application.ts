// src\types\Application.ts

export interface ApplicationDetailsType {
  id: number;
  userId: number;
  jobId: number;
  dateApplied: string;
  customResume: string;
  coverLetter: string;
  applicationStatus: 'pending' | 'reviewed' | 'rejected' | 'accepted';
}

export interface UpdateApplicationType {
  id: number;
  userId: number;
  dateApplied: string;
  coverLetter: string;
  customResume: string;
}
