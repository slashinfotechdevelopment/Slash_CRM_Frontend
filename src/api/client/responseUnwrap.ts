/**
 * Shared Response Unwrap Utility
 * Authoritative handler for unwrapping Axios responses and NestJS standard payload envelopes.
 * Eliminates redundant extraction logic across all feature connectors.
 */

import { AxiosResponse } from 'axios';
import { ApiResponse } from '@/api/types/api.types';

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

/**
 * Safely unwrap data payload from an Axios response, NestJS standard envelope, or raw entity
 */
export function extractData<T>(
  response: AxiosResponse<ApiResponse<T> | T> | ApiResponse<T> | T | unknown
): T {
  let current: unknown = response;

  // 1. Unwrap Axios response object if passed
  if (
    current &&
    typeof current === 'object' &&
    'data' in current &&
    ('status' in current || 'headers' in current)
  ) {
    current = (current as { data: unknown }).data;
  }

  // 2. Unwrap NestJS API envelope { success: true, data: ... }
  while (
    current &&
    typeof current === 'object' &&
    'data' in current &&
    !Array.isArray(current) &&
    ('success' in current || 'statusCode' in current || (Object.keys(current).length <= 3 && !('id' in current)))
  ) {
    current = (current as { data: unknown }).data;
  }

  return current as T;
}

/**
 * Safely unwrap paginated data structures from diverse backend controller payload shapes
 */
export function extractPaginated<T>(
  response: unknown,
  defaultLimit = 20,
  defaultPage = 1
): PaginatedResult<T> {
  let current: unknown = response;

  // 1. Unwrap Axios response object if passed
  if (
    current &&
    typeof current === 'object' &&
    'data' in current &&
    ('status' in current || 'headers' in current)
  ) {
    current = (current as { data: unknown }).data;
  }

  // 2. Unwrap NestJS API envelope { success: true, data: ... }
  while (
    current &&
    typeof current === 'object' &&
    'data' in current &&
    !Array.isArray(current) &&
    ('success' in current || 'statusCode' in current || (Object.keys(current).length <= 3 && !('id' in current)))
  ) {
    current = (current as { data: unknown }).data;
  }

  let items: T[] = [];
  let total = 0;

  if (Array.isArray(current)) {
    items = current as T[];
    total = items.length;
  } else if (current && typeof current === 'object') {
    const record = current as Record<string, unknown>;

    if (Array.isArray(record.items)) {
      items = record.items as T[];
    } else if (Array.isArray(record.data)) {
      items = record.data as T[];
    } else if (Array.isArray(record.records)) {
      items = record.records as T[];
    } else if (Array.isArray(record.tasks)) {
      items = record.tasks as T[];
    } else if (Array.isArray(record.leads)) {
      items = record.leads as T[];
    } else if (Array.isArray(record.users)) {
      items = record.users as T[];
    } else if (Array.isArray(record.shifts)) {
      items = record.shifts as T[];
    } else if (Array.isArray(record.leaves)) {
      items = record.leaves as T[];
    } else if (Array.isArray(record.requests)) {
      items = record.requests as T[];
    } else if (Array.isArray(record.balances)) {
      items = record.balances as T[];
    } else if (Array.isArray(record.transactions)) {
      items = record.transactions as T[];
    } else if (Array.isArray(record.holidays)) {
      items = record.holidays as T[];
    } else if (Array.isArray(record.policies)) {
      items = record.policies as T[];
    } else if (Array.isArray(record.runs)) {
      items = record.runs as T[];
    } else if (Array.isArray(record.anomalies)) {
      items = record.anomalies as T[];
    } else if (Array.isArray(record.results)) {
      items = record.results as T[];
    }

    const pagination = record.pagination as Record<string, unknown> | undefined;

    const rawTotal =
      record.total ??
      pagination?.total ??
      pagination?.totalItems ??
      record.count ??
      items.length;
    total = typeof rawTotal === 'number' ? rawTotal : Number(rawTotal) || items.length;
  }

  const recordObj = (current && typeof current === 'object' ? current : {}) as Record<string, unknown>;
  const paginationObj = recordObj.pagination as Record<string, unknown> | undefined;

  const rawPage = recordObj.page ?? paginationObj?.page ?? defaultPage;
  const rawLimit = recordObj.limit ?? paginationObj?.limit ?? defaultLimit;

  const effectivePage = typeof rawPage === 'number' ? rawPage : Number(rawPage) || defaultPage;
  const effectiveLimit = typeof rawLimit === 'number' ? rawLimit : Number(rawLimit) || defaultLimit;
  const hasMore = effectivePage * effectiveLimit < total;

  return {
    items,
    total,
    hasMore,
    page: effectivePage,
    limit: effectiveLimit,
  };
}
