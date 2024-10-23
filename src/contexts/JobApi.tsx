// src\contexts\JobApi.tsx

export const fetchJobs = async (page: number, items: number, query = '', token: string | null) => {
  const url =
    query.length > 0
      ? `/api/job/search?value=${query}&page=${page}&items=${items}`
      : `/api/job?page=${page}&items=${items}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch jobs: Unauthorized');
  }

  const data = await response.json();
  return data;
};

export const fecthApplications = async (page: number, items: number, token: string | null) => {
  const response = await fetch(`/api/application?page=${page}&items=${items}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch applications: Unauthorized');
  }

  const data = await response.json();
  console.log(data);
  return data;
};
