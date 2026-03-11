import { useState } from 'react';

/** Type interface */
export interface PostResult<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | null;
  post: (body: any, headers?: Record<string, string>) => Promise<void>;
}

/** Post hook — pass a URL, returns post function, data, loading, and error state */
export function usePost<T>(url: string): PostResult<T> {
  const [data, setData] = useState<T>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const post = async (body: any, headers: Record<string, string> = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(`Error status: ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, post };
}
