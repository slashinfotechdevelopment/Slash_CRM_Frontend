import { useState, useCallback } from 'react';
import { NormalizedError } from '@/api/client/errorMapper';

export interface UseMutationOptions<TData, TVariables> {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: NormalizedError, variables: TVariables) => void | Promise<void>;
}

export function useMutation<TData, TVariables = void>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: UseMutationOptions<TData, TVariables> = {}
) {
  const [data, setData] = useState<TData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<NormalizedError | null>(null);

  const mutateAsync = useCallback(
    async (variables: TVariables): Promise<TData> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await mutationFn(variables);
        setData(result);
        setIsLoading(false);
        await options.onSuccess?.(result, variables);
        return result;
      } catch (err) {
        setError(err);
        setIsLoading(false);
        await options.onError?.(err, variables);
        throw err;
      }
    },
    [mutationFn, options]
  );

  return {
    mutateAsync,
    data,
    isLoading,
    error,
    reset: () => {
      setData(null);
      setError(null);
      setIsLoading(false);
    },
  };
}
