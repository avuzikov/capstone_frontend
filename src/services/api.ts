// src\services\api.ts

import { UserRegistration } from '../types/User';
import { ApplicationDetailsType, UpdateApplicationType } from '../types/Application';

const ACCOUNT_BASE_URL = 'http://localhost:8180';
const DATA_BASE_URL = 'http://localhost:8000';

type GetJobDetailsType = {
  id: string | undefined;
  token: string | null;
};

type GetUserDetailsType = {
  id: string | undefined;
  token: string | null;
};

type GetApplicationDetailsType = {
  id: string | undefined;
  token: string | null;
};

type UpdateApplicationDetailsType = {
  id: string | undefined;
  token: string | null;
  application: ApplicationDetailsType;
};

export const register = async (user: UserRegistration) => {
  const response = await fetch(`${ACCOUNT_BASE_URL}/registration`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(user),
  });

  console.log(response.body);

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to register new user');
  }

  return responseData.token;
};

export const getJobDetails = async ({ id, token }: GetJobDetailsType) => {
  const response = await fetch(`${DATA_BASE_URL}/api/job/${id}`, {
    method: 'GET',
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch job details');
  }

  return responseData;
};

export const getUserDetails = async ({ id, token }: GetUserDetailsType) => {
  const response = await fetch(`${ACCOUNT_BASE_URL}/users/manager/${id}`, {
    method: 'GET',
  });

  const responseData = await response.json();
  console.log(responseData);

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch user details');
  }

  return responseData;
};

export const getApplicationDetails = async ({ id, token }: GetApplicationDetailsType) => {
  const response = await fetch(`${DATA_BASE_URL}/api/application/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch application details');
  }

  return responseData;
};

export const updateApplication = async ({
  id,
  token,
  application,
}: UpdateApplicationDetailsType) => {
  const updatedApplication: UpdateApplicationType = {
    candidateId: application.candidateId,
    candidateEmail: application.candidateEmail,
    jobId: application.job.id,
    coverLetter: application.coverLetter,
    customResume: application.customResume,
    applicationStatus: application.applicationStatus,
    yearsOfExperience: application.yearsOfExperience,
  };
  console.log(updatedApplication);
  const response = await fetch(`${DATA_BASE_URL}/api/application/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(updatedApplication),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to fetch application details');
  }

  return responseData;
};
