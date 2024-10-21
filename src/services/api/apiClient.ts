// src\services\api\apiClient.ts
import { User, Job, Application } from '../../types/types';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
  }

  private async fetchWithAuth(
    url: string,
    options: FetchOptions = {},
    token: string | null
  ): Promise<any> {
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(this.baseUrl + url, { ...options, headers });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // User related methods
  async fetchUsers(token: string | null): Promise<User[]> {
    return this.fetchWithAuth('/users', { method: 'GET' }, token);
  }

  async fetchManager(id: string, token: string | null): Promise<User> {
    return this.fetchWithAuth(`/users/${id}`, { method: 'GET' }, token);
  }

  async createUser(formData: Partial<User>, token: string | null): Promise<User> {
    return this.fetchWithAuth(
      '/users/registration',
      {
        method: 'POST',
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      },
      token
    );
  }

  async createManager(formData: Partial<User>, token: string | null): Promise<User> {
    return this.fetchWithAuth(
      '/users/registration/admin',
      {
        method: 'POST',
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }),
      },
      token
    );
  }

  async updateUser(id: string, formData: Partial<User>, token: string | null): Promise<User> {
    return this.fetchWithAuth(
      `/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(formData),
      },
      token
    );
  }

  async deleteUser(id: string, token: string | null): Promise<void> {
    await this.fetchWithAuth(`/users/${id}`, { method: 'DELETE' }, token);
  }

  // Job related methods
  async fetchJobs(token: string | null): Promise<Job[]> {
    const data = await this.fetchWithAuth('/api/job?page=1&items=1000', { method: 'GET' }, token);
    return data.jobs;
  }

  async fetchJob(id: string, token: string | null): Promise<Job> {
    return this.fetchWithAuth(`/api/job/${id}`, { method: 'GET' }, token);
  }

  async createJob(jobData: Partial<Job>, token: string | null): Promise<Job> {
    return this.fetchWithAuth(
      '/api/job',
      {
        method: 'POST',
        body: JSON.stringify(jobData),
      },
      token
    );
  }

  async updateJob(id: string, jobData: Partial<Job>, token: string | null): Promise<Job> {
    return this.fetchWithAuth(
      `/api/job/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(jobData),
      },
      token
    );
  }

  async deleteJob(id: string, token: string | null): Promise<void> {
    await this.fetchWithAuth(`/api/job/${id}`, { method: 'DELETE' }, token);
  }

  // Application related methods
  async fetchApplications(token: string | null): Promise<Application[]> {
    return this.fetchWithAuth('/api/application', { method: 'GET' }, token);
  }

  async createApplication(
    applicationData: Partial<Application>,
    token: string | null
  ): Promise<Application> {
    return this.fetchWithAuth(
      '/api/application',
      {
        method: 'POST',
        body: JSON.stringify(applicationData),
      },
      token
    );
  }

  async updateApplication(
    id: string,
    applicationData: Partial<Application>,
    token: string | null
  ): Promise<Application> {
    return this.fetchWithAuth(
      `/api/application/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(applicationData),
      },
      token
    );
  }

  async deleteApplication(id: string, token: string | null): Promise<void> {
    await this.fetchWithAuth(`/api/application/${id}`, { method: 'DELETE' }, token);
  }
}

const apiClient = new ApiClient();
export default apiClient;
