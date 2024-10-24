// src\contexts\JobApi.tsx

const DATA_BASE_URL = 'http://localhost:8000';

export const fetchJobs = async (page: number, items: number, query = '', token: string | null) => {
  const url =
    query.length > 0
      ? `${DATA_BASE_URL}/api/job/search?value=${query}&page=${page}&items=${items}`
      : `${DATA_BASE_URL}/api/job/page?page=${page}&items=${items}`;

  const response = await fetch(url, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs: Unauthorized');
  }

  const data = await response.json();
  return data;
};

export const fecthApplications = async (page: number, items: number, token: string | null) => {
  const response = await fetch(
    `${DATA_BASE_URL}/api/application/page?page=${page}&items=${items}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch applications: Unauthorized');
  }

  const data = await response.json();
  return data;
};
