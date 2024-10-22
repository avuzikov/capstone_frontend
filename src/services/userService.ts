// src/services/userService.ts

import { apiClient } from './apiClient';
import { ENDPOINTS } from './endpoints';
import { User } from '../types/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

interface AuthResponse {
  id: string;
  role: string;
}

interface ManagerPublicInfo {
  id: number;
  fullName: string;
  department?: string;
  publicContactInfo?: string;
}

export const userService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    return apiClient.request(ENDPOINTS.users.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.request(ENDPOINTS.users.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async registerManager(userData: RegisterRequest): Promise<AuthResponse> {
    return apiClient.request(ENDPOINTS.users.registerManager, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  async getUserById(id: string): Promise<User> {
    return apiClient.request(ENDPOINTS.users.byId(id));
  },

  async getManagerPublicInfo(id: string): Promise<ManagerPublicInfo> {
    return apiClient.request(`/user/manager/${id}`);
  },

  async getManagerUsers(id: string): Promise<User[]> {
    return apiClient.request(ENDPOINTS.users.adminById(id));
  },

  async updateUser(id: string, userData: Partial<User>): Promise<User> {
    return apiClient.request(ENDPOINTS.users.byId(id), {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  async deleteUser(id: string): Promise<void> {
    return apiClient.request(ENDPOINTS.users.byId(id), {
      method: 'DELETE',
    });
  },
};
