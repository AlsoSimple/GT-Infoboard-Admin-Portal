import { useEffect, useState } from 'react';

export interface FetchResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
}

/**
 * useFetchV2 — fetch data with optional headers (e.g., Authorization)
 * @param url The URL to fetch
 * @param headers Optional headers object
 */
export function useFetchV2<T>(url: string, headers: Record<string, string> = {}): FetchResult<T> {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(url, { headers });
        if (!res.ok) throw new Error(`Error status: ${res.status}`);
        const json = await res.json();
        if (!ignore) setData(json);
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }
    fetchData();
    return () => { ignore = true; };
  }, [url, JSON.stringify(headers)]);

  return { data, isLoading, error };
}
