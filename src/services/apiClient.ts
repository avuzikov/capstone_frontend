// src/services/apiClient.ts

// These will be used when switching to real API
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

// When using MSW, baseUrl should be empty string as MSW intercepts the request
// When switching to real API, we'll use the appropriate base URL
export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('authToken');

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const response = await fetch(endpoint, {
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
