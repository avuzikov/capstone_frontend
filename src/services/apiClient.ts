// src/services/apiClient.ts

const API_CONFIG = {
  userService: process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8000',
  jobService: process.env.REACT_APP_JOB_SERVICE_URL || 'http://localhost:7000',
};

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');
    // Determine which base URL to use
    const baseUrl = endpoint.startsWith('/users') ? API_CONFIG.userService : API_CONFIG.jobService;

    const url = `${baseUrl}${endpoint}`;

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include', // Important for cookies
    });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    // Some endpoints return no content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  },
};
