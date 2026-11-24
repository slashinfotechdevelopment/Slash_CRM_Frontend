import { useState, useEffect, useCallback, useRef } from 'react';
import { NormalizedError, normalizeError } from '@/api/client/errorMapper';

export interface UseQueryOptions<T> {
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (err: NormalizedError) => void;
}

export function useQuery<T>(
  queryFn: () => Promise<T>,
  deps: unknown[] = [],
  options: UseQueryOptions<T> = {}
) {
  const { enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(enabled);
  const [error, setError] = useState<NormalizedError | null>(null);

  const isMountedRef = useRef(true);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const execute = useCallback(async () => {
    if (!enabled) return;
    setIsLoading(true);
    setError(null);

    try {
      const result = await queryFn();
      if (isMountedRef.current) {
        setData(result);
        setIsLoading(false);
        optionsRef.current.onSuccess?.(result);
      }
    } catch (err) {
      if (isMountedRef.current) {
        const norm = normalizeError(err);
        setError(norm);
        setIsLoading(false);
        optionsRef.current.onError?.(norm);
      }
    }
  }, [enabled, ...deps]);

  useEffect(() => {
    isMountedRef.current = true;
    execute();
    return () => {
      isMountedRef.current = false;
    };
  }, [execute]);

  return {
    data,
    isLoading,
    error,
    refetch: execute,
  };
}
