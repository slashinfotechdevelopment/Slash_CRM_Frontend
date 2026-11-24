import React from 'react';
import { TableSkeleton } from './Skeleton';
import { ErrorState } from './ErrorState';
import { EmptyState } from './EmptyState';

export interface StateViewProps {
  isLoading: boolean;
  error?: Error | { message?: string } | string | null;
  isEmpty: boolean;
  onRetry?: () => void;
  skeleton?: React.ReactNode;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyActionLabel?: string;
  onEmptyAction?: () => void;
  emptyIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const StateView: React.FC<StateViewProps> = ({
  isLoading,
  error,
  isEmpty,
  onRetry,
  skeleton,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no records to display at this time.',
  emptyActionLabel,
  onEmptyAction,
  emptyIcon,
  children,
}) => {
  if (isLoading) {
    return <>{skeleton || <TableSkeleton rows={5} columns={4} />}</>;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load content"
        message={typeof error === 'string' ? error : error?.message || 'Unable to retrieve data from the server.'}
        onRetry={onRetry}
      />
    );
  }

  if (isEmpty) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        actionLabel={emptyActionLabel}
        onAction={onEmptyAction}
        icon={emptyIcon}
      />
    );
  }

  return <>{children}</>;
};
