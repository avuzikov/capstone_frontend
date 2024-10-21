// src/utils/apiUtils.ts

import { User, Job, Application } from '../types/types';

interface FetchOptions {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
}

export const fetchWithAuth = async (
  url: string,
  options: FetchOptions = {},
  token: string | null
) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const fetchManager = async (id: string, token: string | null): Promise<User> => {
  return fetchWithAuth(`/users/${id}`, { method: 'GET' }, token);
};

export const createManager = async (
  formData: Partial<User>,
  token: string | null
): Promise<User> => {
  return fetchWithAuth(
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
};

export const updateManager = async (
  id: string,
  formData: Partial<User>,
  token: string | null
): Promise<User> => {
  return fetchWithAuth(
    `/users/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(formData),
    },
    token
  );
};

export const deleteManager = async (id: string, token: string | null): Promise<void> => {
  await fetchWithAuth(`/users/${id}`, { method: 'DELETE' }, token);
};

export const fetchJobs = async (token: string | null): Promise<Job[]> => {
  const data = await fetchWithAuth('/api/job?page=1&items=1000', { method: 'GET' }, token);
  return data.jobs;
};

export const fetchUsers = async (token: string | null): Promise<User[]> => {
  return fetchWithAuth('/users', { method: 'GET' }, token);
};

export const createUser = async (formData: Partial<User>, token: string | null): Promise<User> => {
  return fetchWithAuth(
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
};

export const updateUser = async (
  id: string,
  formData: Partial<User>,
  token: string | null
): Promise<User> => {
  return fetchWithAuth(
    `/users/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(formData),
    },
    token
  );
};

export const deleteUser = async (id: string | undefined, token: string | null): Promise<void> => {
  if (!id) {
    throw new Error('No user ID provided for deletion');
  }
  await fetchWithAuth(`/users/${id}`, { method: 'DELETE' }, token);
};

export const fetchJob = async (id: string, token: string | null): Promise<Job> => {
  return fetchWithAuth(`/api/job/${id}`, { method: 'GET' }, token);
};

export const createJob = async (jobData: Partial<Job>, token: string | null): Promise<Job> => {
  return fetchWithAuth(
    '/api/job',
    {
      method: 'POST',
      body: JSON.stringify(jobData),
    },
    token
  );
};

export const updateJob = async (
  id: string,
  jobData: Partial<Job>,
  token: string | null
): Promise<Job> => {
  return fetchWithAuth(
    `/api/job/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(jobData),
    },
    token
  );
};

export const deleteJob = async (id: string, token: string | null): Promise<void> => {
  await fetchWithAuth(`/api/job/${id}`, { method: 'DELETE' }, token);
};

export const fetchApplications = async (token: string | null): Promise<Application[]> => {
  return fetchWithAuth('/api/application', { method: 'GET' }, token);
};

export const createApplication = async (
  applicationData: Partial<Application>,
  token: string | null
): Promise<Application> => {
  return fetchWithAuth(
    '/api/application',
    {
      method: 'POST',
      body: JSON.stringify(applicationData),
    },
    token
  );
};

export const updateApplication = async (
  id: string,
  applicationData: Partial<Application>,
  token: string | null
): Promise<Application> => {
  return fetchWithAuth(
    `/api/application/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(applicationData),
    },
    token
  );
};

export const deleteApplication = async (id: string, token: string | null): Promise<void> => {
  await fetchWithAuth(`/api/application/${id}`, { method: 'DELETE' }, token);
};
