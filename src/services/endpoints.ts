// src/services/endpoints.ts

export const ENDPOINTS = {
  users: {
    login: '/users/login',
    register: '/users/registration',
    registerManager: '/users/registration/admin',
    base: '/users',
    byId: (id: string) => `/users/${id}`,
    adminById: (id: string) => `/users/admin/${id}`,
    managerInfo: (id: string) => `/user/manager/${id}`,
  },
  jobs: {
    base: '/api/job',
    byId: (id: string) => `/api/job/${id}`,
    transfer: '/api/job/transfer',
    page: (page: number, items: number) => `/api/job/page?page=${page}&items=${items}`,
    applications: (id: string) => `/api/job/${id}/applications`,
    stats: '/api/stats/manager',
    manager: '/api/job/manager',
  },
  applications: {
    base: '/api/application',
    byId: (id: string) => `/api/application/${id}`,
    manager: (id: string) => `/api/application/manager/${id}`,
  },
  manager: {
    jobs: '/api/job/manager',
    stats: '/api/stats/manager',
  },
} as const;
