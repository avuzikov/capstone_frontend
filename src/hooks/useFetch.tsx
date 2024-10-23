// src\hooks\useFetch.tsx

import { useState, useCallback } from 'react';

const useFetch = <T,>(fetchFn: (data: T) => Promise<any>, initialValue?: any) => {
  const [data, setData] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<null | { message: string }>(null);

  const fetchDispatch = useCallback(
    async (data: T) => {
      setIsPending(true);
      setError(null);

      try {
        const response = await fetchFn(data);
        setData(response);
      } catch (error: any) {
        setError({ message: error.message || 'Failed to fetch data' });
      } finally {
        setIsPending(false);
      }
    },
    [fetchFn]
  );

  return { data, isPending, error, fetchDispatch };
};

export default useFetch;
