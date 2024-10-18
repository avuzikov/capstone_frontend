import { useState, useCallback } from "react";

const useFetch = (fetchFn: () => Promise<any>, initialValue?: any) => {
  const [data, setData] = useState(initialValue);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<null | { message: string }>(null);

  const fetchDispatch = useCallback(async () => {
    setIsPending(true);
    setError(null);

    try {
      const response = await fetchFn();
      setData(response);
    } catch (error: any) {
      setError({ message: error.message || "Failed to fetch data" });
    } finally {
      setIsPending(false);
    }
  }, [fetchFn]);

  return { data, isPending, error, fetchDispatch };
};

export default useFetch;
