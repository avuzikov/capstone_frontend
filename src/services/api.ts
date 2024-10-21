// src\services\api.ts
import { UserRegistration } from "../types/User";

const BASE_URL = "";

type GetJobDetailsType = {
  id: string | undefined;
  token: string | null;
};

type GetUserDetailsType = {
  id: string | undefined;
  token: string | null;
};

export const register = async (user: UserRegistration) => {
  const response = await fetch(`${BASE_URL}/users/registration`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to register new user");
  }

  return responseData;
};

export const getJobDetails = async ({ id, token }: GetJobDetailsType) => {
  const response = await fetch(`${BASE_URL}/api/job/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch job details");
  }

  return responseData;
};

export const getUserDetails = async ({ id, token }: GetUserDetailsType) => {
  const response = await fetch(`${BASE_URL}/api/user/manager/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to fetch user details");
  }

  return responseData;
};
