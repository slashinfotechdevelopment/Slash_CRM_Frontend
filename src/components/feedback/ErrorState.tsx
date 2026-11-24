import React from 'react';
import { Button } from '@/components/ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'We encountered an error while loading the requested data. Please try again.',
  onRetry,
  className,
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center p-8 sm:p-12 text-center bg-white rounded-xl border border-red-100 shadow-sm ${
        className || ''
      }`}
    >
      <div className="w-12 h-12 mb-4 rounded-full bg-red-50 flex items-center justify-center text-red-500">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
      <p className="mt-1 text-sm text-slate-500 max-w-md">{message}</p>
      {onRetry && (
        <div className="mt-6">
          <Button
            variant="outline"
            size="md"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
};
