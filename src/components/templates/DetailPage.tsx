import React from 'react';
import { DetailSkeleton } from '@/components/feedback/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { ArrowLeft } from 'lucide-react';

export interface DetailField {
  label: string;
  value: React.ReactNode;
  span?: 1 | 2;
}

export interface DetailPageProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  onBack?: () => void;
  actions?: React.ReactNode;
  isLoading?: boolean;
  error?: Error | { message?: string } | string | null;
  onRetry?: () => void;
  fields?: DetailField[];
  children?: React.ReactNode;
}

export const DetailPage: React.FC<DetailPageProps> = ({
  title,
  subtitle,
  badge,
  onBack,
  actions,
  isLoading,
  error,
  onRetry,
  fields = [],
  children,
}) => {
  if (isLoading) {
    return <DetailSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load details"
        message={typeof error === 'string' ? error : error?.message || 'Unable to load record details.'}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="w-full space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-start gap-4">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="p-2 -ml-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
              {badge}
            </div>
            {subtitle && (
              <p className="mt-1 text-sm text-slate-500 leading-normal">{subtitle}</p>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex items-center gap-2.5 flex-shrink-0">{actions}</div>
        )}
      </div>

      {/* Field Overview Grid */}
      {fields.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
            Overview & Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
            {fields.map((field, idx) => (
              <div
                key={idx}
                className={field.span === 2 ? 'sm:col-span-2' : undefined}
              >
                <span className="text-xs font-medium text-slate-400 block mb-1">
                  {field.label}
                </span>
                <div className="text-sm font-medium text-slate-800">
                  {field.value ?? '-'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Body / Tabs / Subsections */}
      {children}
    </div>
  );
};
