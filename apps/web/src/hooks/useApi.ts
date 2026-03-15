import { useCallback, useEffect, useState } from "react";

const API_BASE = import.meta.env.PUBLIC_API_URL ?? "/api";

interface UseApiOptions<T> {
  url: string;
  method?: "GET" | "POST";
  body?: unknown;
  immediate?: boolean;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useApi<T>({ url, method = "GET", body, immediate = true }: UseApiOptions<T>): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const options: RequestInit = { method };
      if (body) {
        options.headers = { "Content-Type": "application/json" };
        options.body = JSON.stringify(body);
      }
      const res = await fetch(`${API_BASE}${url}`, options);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const json = (await res.json()) as { data: T };
      setData(json.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [url, method, body]);

  useEffect(() => {
    if (immediate) fetchData();
  }, [fetchData, immediate]);

  return { data, loading, error, refetch: fetchData };
}
