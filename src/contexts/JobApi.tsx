export const fetchJobs = async (page: number, items: number, query = '', token: string | null) => {
  const searchParam = query ? `&search=${encodeURIComponent(query)}` : '';
  console.log(token);
  const response = await fetch(`/api/job?page=${page}&items=3`, {
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
  
  const response = await fetch(`/api/application?page=${page}&items=4`, {
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
  console.log(data)
  return data;
};