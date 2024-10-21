// src\types\Job.ts
export interface JobDetailsType {
  id: number;
  userId: number;
  listingTitle: string;
  department: string;
  listingStatus: 'open' | 'closed';
  dateListed: string;
  dateClosed: string;
  jobTitle: string;
  jobDescription: string;
  experienceLevel: string;
  additionalInformation: string;
}
