import React, { useEffect, useRef } from 'react';
import { ColumnDef, DataTable } from './DataTable';
import { FilterBar, FilterSelectConfig } from './FilterBar';
import { TableSkeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Loader2 } from 'lucide-react';

export interface ListPageProps<T> {
  title: string;
  description?: string;
  headerActions?: React.ReactNode;
  columns: ColumnDef<T>[];
  items: T[];
  total?: number;
  isLoading: boolean;
  isLoadingMore?: boolean;
  hasMore?: boolean;
  error?: Error | { message?: string } | string | null;
  onRetry?: () => void;
  onLoadMore?: () => void;
  // Filters & Search
  search?: string;
  onSearchChange?: (val: string) => void;
  searchPlaceholder?: string;
  filters?: FilterSelectConfig[];
  onFilterChange?: (key: string, val: string | number) => void;
  filterActions?: React.ReactNode;
  // Row interaction
  onRowClick?: (item: T) => void;
  // Empty state customizations
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  emptyIcon?: React.ReactNode;
  // Custom child view (e.g. Kanban or Grid)
  children?: React.ReactNode;
}

export function ListPage<T extends object>({
  title,
  description,
  headerActions,
  columns,
  items,
  total,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  onRetry,
  onLoadMore,
  search,
  onSearchChange,
  searchPlaceholder,
  filters,
  onFilterChange,
  filterActions,
  onRowClick,
  emptyTitle = 'No records found',
  emptyDescription = 'There are currently no items matching your criteria.',
  emptyActionLabel,
  onEmptyAction,
  emptyIcon,
  children,
}: ListPageProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Infinite scroll intersection observer
  useEffect(() => {
    if (!sentinelRef.current || !onLoadMore || !hasMore || isLoading || isLoadingMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading && !isLoadingMore) {
          onLoadMore();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [onLoadMore, hasMore, isLoading, isLoadingMore]);

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {title}
            {total !== undefined && total > 0 && (
              <span className="ml-2.5 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                {total}
              </span>
            )}
          </h1>
          {description && (
            <p className="mt-1 text-sm text-slate-500 leading-normal">{description}</p>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center gap-3 flex-shrink-0">{headerActions}</div>
        )}
      </div>

      {/* Filter / Search Bar */}
      {(onSearchChange || (filters && filters.length > 0) || filterActions) && (
        <FilterBar
          search={search}
          onSearchChange={onSearchChange}
          searchPlaceholder={searchPlaceholder}
          filters={filters}
          onFilterChange={onFilterChange}
          actions={filterActions}
        />
      )}

      {/* Main Content Area */}
      {isLoading ? (
        <TableSkeleton rows={6} columns={columns.length} />
      ) : error ? (
        <ErrorState
          title="Failed to load items"
          message={typeof error === 'string' ? error : error?.message || 'Unable to retrieve data from server.'}
          onRetry={onRetry}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={emptyIcon}
          title={emptyTitle}
          description={emptyDescription}
          actionLabel={emptyActionLabel}
          onAction={onEmptyAction}
        />
      ) : children ? (
        <div className="w-full">{children}</div>
      ) : (
        <div className="space-y-4">
          <DataTable
            data={items}
            columns={columns}
            onRowClick={onRowClick}
          />

          {/* Infinite Scroll Sentinel */}
          <div ref={sentinelRef} className="py-4 flex justify-center">
            {isLoadingMore && (
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-brand-primary" />
                <span>Loading more records...</span>
              </div>
            )}
            {!hasMore && items.length > 10 && (
              <p className="text-xs text-slate-400 font-medium select-none">
                All {items.length} records loaded
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
