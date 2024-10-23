// src/services/jobService.ts
import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { Job, Application } from '../types/types';
import { ManagerStats } from './types';

interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface ManagerJobsResponse {
  content: (Job & { applicantCount?: number })[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
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
  last: boolean;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

interface JobApplicationsResponse {
  total: number;
  page: number;
  items: number;
  applications: (Application & { applicantName?: string })[];
}

interface JobTransfer {
  jobId: number;
  fromUserId: number;
  toUserId: number;
}

interface PaginationParams {
  page: number;
  items?: number;
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

  // Manager specific endpoints
  async getManagerJobs(params: PaginationParams): Promise<ManagerJobsResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('page', params.page.toString());
    if (params.items) {
      queryParams.append('items', params.items.toString());
    }
    return apiClient.request(`/api/job/manager?${queryParams.toString()}`);
  },

  async getManagerStats(): Promise<ManagerStats> {
    return apiClient.request('/api/stats/manager');
  },

  // Applications
  async getApplications(jobId: string): Promise<Application[]> {
    return apiClient.request(ENDPOINTS.jobs.applications(jobId));
  },

  async getJobApplications(
    jobId: string,
    params?: PaginationParams
  ): Promise<JobApplicationsResponse> {
    const queryParams = new URLSearchParams();
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.items) {
      queryParams.append('items', params.items.toString());
    }
    return apiClient.request(
      `/api/application/job/${jobId}${queryParams.toString() ? `?${queryParams.toString()}` : ''}`
    );
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
