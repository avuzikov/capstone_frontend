// src/services/types.ts

// User types
export type UserRole = 'applicant' | 'hiring-manager' | 'admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  role: UserRole;
  address?: string;
  phone?: string;
  resume?: string;
  department?: string;
}

// Job types
export type JobStatus = 'open' | 'closed';

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
  listingStatus: JobStatus;
  experienceLevel: string;
  modelResume?: string;
  modelCoverLetter?: string;
}

// Application types
export type ApplicationStatus = 'pending' | 'reviewed' | 'rejected' | 'accepted';

export interface Application {
  id: number;
  userId: number;
  jobId: number;
  dateApplied: string;
  coverLetter: string;
  customResume: string;
  applicationStatus: ApplicationStatus;
}

// Service response types
export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  id: string;
  role: UserRole;
  token?: string; // If token is returned in response body instead of cookie
}

// Job management types
export interface JobTransferRequest {
  jobId: number;
  fromUserId: number;
  toUserId: number;
}

// Application management types
export interface ApplicationStatusUpdate {
  applicationStatus: ApplicationStatus;
}

// API Error types
export interface ApiErrorResponse {
  message: string;
  code?: string;
  data?: unknown;
}

// Search and filter types
export interface JobSearchParams {
  page: number;
  items?: number;
  query?: string;
}

export interface ApplicationFilterParams {
  page: number;
  items?: number;
  status?: ApplicationStatus;
  sortBy?: 'date' | 'status';
}

// Extended types for statistics (as mentioned in the API docs)
export interface ApplicationStatistics extends Application {
  yearsOfExperience?: number;
  matchJobDescriptionScore?: number;
  pastExperienceScore?: number;
  motivationScore?: number;
  academicAchievementScore?: number;
  pedigreeScore?: number;
  trajectoryScore?: number;
  extenuatingCircumstancesScore?: number;
  averageScore?: string;
  review?: string;
}
