// src/services/jobService.ts
import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { Job, Application } from '../types/types';

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface JobTransfer {
  jobId: number;
  fromUserId: number;
  toUserId: number;
}

export const jobService = {
  async getJobs(page: number, items = 20): Promise<PaginatedResponse<Job>> {
    return apiClient.request(ENDPOINTS.jobs.page(page, items));
  },

  async getJobById(id: string): Promise<Job> {
    return apiClient.request(ENDPOINTS.jobs.byId(id));
  },

  async createJob(jobData: Partial<Job>): Promise<Job> {
    return apiClient.request(ENDPOINTS.jobs.base, {
      method: 'POST',
      body: JSON.stringify(jobData),
    });
  },

  async updateJob(id: string, jobData: Partial<Job>): Promise<Job> {
    return apiClient.request(ENDPOINTS.jobs.byId(id), {
      method: 'PUT',
      body: JSON.stringify(jobData),
    });
  },

  async transferJob(transferData: JobTransfer): Promise<Job> {
    return apiClient.request(ENDPOINTS.jobs.transfer, {
      method: 'PUT',
      body: JSON.stringify(transferData),
    });
  },

  async deleteJob(id: string): Promise<void> {
    return apiClient.request(ENDPOINTS.jobs.byId(id), {
      method: 'DELETE',
    });
  },

  // Applications
  async getApplications(jobId: string): Promise<Application[]> {
    return apiClient.request(ENDPOINTS.jobs.applications(jobId));
  },

  async getApplicationById(id: string): Promise<Application> {
    return apiClient.request(ENDPOINTS.applications.byId(id));
  },

  async createApplication(applicationData: Partial<Application>): Promise<Application> {
    return apiClient.request(ENDPOINTS.applications.base, {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  async updateApplication(id: string, applicationData: Partial<Application>): Promise<Application> {
    return apiClient.request(ENDPOINTS.applications.byId(id), {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    });
  },

  async updateApplicationStatus(
    id: string,
    status: Application['applicationStatus']
  ): Promise<Application> {
    return apiClient.request(ENDPOINTS.applications.manager(id), {
      method: 'PUT',
      body: JSON.stringify({ applicationStatus: status }),
    });
  },

  async deleteApplication(id: string): Promise<void> {
    return apiClient.request(ENDPOINTS.applications.byId(id), {
      method: 'DELETE',
    });
  },
};
