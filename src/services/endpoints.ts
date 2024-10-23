// src/services/endpoints.ts

const USER_BASE = '/users';
const API_BASE = '/api';

export const ENDPOINTS = {
  users: {
    login: `${USER_BASE}/login`,
    register: `${USER_BASE}/registration`,
    registerManager: `${USER_BASE}/registration/admin`,
    base: USER_BASE,
    byId: (id: string) => `${USER_BASE}/${id}`,
    adminById: (id: string) => `${USER_BASE}/admin/${id}`,
    managerInfo: (id: string) => `${USER_BASE}/manager/${id}`,
  },
  jobs: {
    base: `${API_BASE}/job`,
    byId: (id: string) => `${API_BASE}/job/${id}`,
    transfer: `${API_BASE}/job/transfer`,
    page: (page: number, items: number) => `${API_BASE}/job/page?page=${page}&items=${items}`,
    filter: (id: string, filter: string) => `${API_BASE}/job/${id}/filter=${filter}`,
    applications: (id: string) => `${API_BASE}/job/${id}/applications`,
    manager: `${API_BASE}/job/manager`,
  },
  applications: {
    base: `${API_BASE}/application`,
    byId: (id: string) => `${API_BASE}/application/${id}`,
    manager: (id: string) => `${API_BASE}/application/manager/${id}`,
    byJob: (jobId: string) => `${API_BASE}/application/job/${jobId}`,
    statistics: (id: string) => `${API_BASE}/application/${id}/statistics`,
  },
  stats: {
    applicant: `${API_BASE}/stats/applicant`,
    manager: `${API_BASE}/stats/manager`,
    admin: `${API_BASE}/stats/admin`,
  },
} as const;
