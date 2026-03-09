import { useEffect, useState } from 'react';

/** Type interface */
export interface FetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
}

/** Fetch hook — pass a URL type, return data, loading, and error state */
export function useFetch<T>(url: string): FetchResult<T> {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch(url);

        if (!res.ok) {
          throw new Error(`Error status: ${res.status}`);
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        // Storeerror message
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        // Stop loading, on fail or success
        setIsLoading(false);
      }
    }

    fetchData();
  }, [url]); // Re-fetch when URL changes

  return { data, isLoading, error };
}