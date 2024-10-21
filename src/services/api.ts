import { UserLogin, UserRegistration } from "../types/User";

const BASE_URL = "";

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

export const getJobDetails = async (id: string, token: string) => {
  const response = await fetch(`${BASE_URL}/jobs/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();

  if (!response.ok) {
    throw new Error(responseData.message || "Failed to register new user");
  }

  return responseData;
};
