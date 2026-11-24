import { useState, useEffect, useCallback, useRef } from 'react';
import { NormalizedError, normalizeError } from '@/api/client/errorMapper';
import { PAGINATION } from '@/config/constants';

export interface InfiniteListOptions<T, F> {
  queryFn: (params: F & { page: number; limit: number }) => Promise<{
    items: T[];
    total?: number;
    hasMore?: boolean;
  }>;
  filters: F;
  limit?: number;
  initialItems?: T[];
  enabled?: boolean;
}

export function useInfiniteList<T extends { id?: string | number }, F extends object = Record<string, unknown>>({
  queryFn,
  filters,
  limit = PAGINATION.DEFAULT_LIMIT,
  initialItems = [],
  enabled = true,
}: InfiniteListOptions<T, F>) {
  const [items, setItems] = useState<T[]>(initialItems);
  const [total, setTotal] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<NormalizedError | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const pageRef = useRef<number>(1);
  const isFetchingRef = useRef<boolean>(false);
  const filtersRef = useRef<F>(filters);
  filtersRef.current = filters;

  const filterStringRef = useRef<string>(JSON.stringify(filters));
  const hasMountedRef = useRef<boolean>(false);
  const prevEnabledRef = useRef<boolean>(enabled);

  const queryFnRef = useRef(queryFn);
  queryFnRef.current = queryFn;

  // Deduplicate helper
  const deduplicate = (existing: T[], incoming: T[]): T[] => {
    const seen = new Set<string | number>();
    const result: T[] = [];

    // Keep existing items
    for (const item of existing) {
      const key = item.id != null ? item.id : JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }

    // Append new items
    for (const item of incoming) {
      const key = item.id != null ? item.id : JSON.stringify(item);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }

    return result;
  };

  const fetchPage = useCallback(
    async (pageToFetch: number, isReset: boolean) => {
      if (!enabled) return;
      if (isFetchingRef.current) return;

      isFetchingRef.current = true;
      if (isReset) {
        setIsLoading(true);
        setError(null);
      } else {
        setIsLoadingMore(true);
      }

      try {
        const response = await queryFnRef.current({
          ...filtersRef.current,
          page: pageToFetch,
          limit,
        });

        const newItems = response.items || [];
        const moreAvailable =
          response.hasMore !== undefined
            ? response.hasMore
            : newItems.length === limit &&
              (response.total === undefined || response.total > pageToFetch * limit);

        if (isReset) {
          setItems(newItems);
          setTotal(response.total ?? newItems.length);
        } else {
          setItems((prev) => deduplicate(prev, newItems));
          setTotal((prevTotal) => response.total ?? (prevTotal + newItems.length));
        }

        setHasMore(moreAvailable);
        pageRef.current = pageToFetch;
      } catch (err) {
        setError(normalizeError(err));
      } finally {
        isFetchingRef.current = false;
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [enabled, limit]
  );

  // Initial fetch and filter change fetch
  useEffect(() => {
    if (!enabled) {
      prevEnabledRef.current = false;
      return;
    }

    const currentFilterStr = JSON.stringify(filters);
    const enabledJustActivated = !prevEnabledRef.current && enabled;
    prevEnabledRef.current = enabled;

    // First mount with enabled = true
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      filterStringRef.current = currentFilterStr;
      pageRef.current = 1;
      fetchPage(1, true);
      return;
    }

    // Tab became enabled or filters meaningfully changed
    if (enabledJustActivated || filterStringRef.current !== currentFilterStr) {
      filterStringRef.current = currentFilterStr;
      pageRef.current = 1;
      fetchPage(1, true);
    }
  }, [enabled, filters, fetchPage]);

  // Load next page
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading || isLoadingMore || isFetchingRef.current) {
      return;
    }
    const nextPage = pageRef.current + 1;
    fetchPage(nextPage, false);
  }, [hasMore, isLoading, isLoadingMore, fetchPage]);

  // Refresh page 1 keeping current filters
  const refresh = useCallback(() => {
    pageRef.current = 1;
    fetchPage(1, true);
  }, [fetchPage]);

  return {
    items,
    total,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMore,
    refresh,
  };
}
