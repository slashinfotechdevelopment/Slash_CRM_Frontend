import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { TableSkeleton } from '@/components/feedback/Skeleton';

interface PermissionGuardProps {
  required?: string | string[];
  matchMode?: 'any' | 'all';
  role?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  required,
  matchMode = 'any',
  role,
  fallback,
  children,
}) => {
  const { isLoading, isAuthenticated, hasPermission, hasRole } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="p-6">
        <TableSkeleton rows={4} columns={3} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Check role requirement
  if (role && !hasRole(role)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl border border-neutral-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-1">Access Restricted</h2>
          <p className="text-xs text-neutral-500 mb-6">
            This module requires elevated administrative privileges ({Array.isArray(role) ? role.join(', ') : role}).
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Check permission requirement
  if (required && !hasPermission(required, matchMode)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="min-h-[400px] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-xl border border-neutral-200 p-8 text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-100">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-1">Access Restricted</h2>
          <p className="text-xs text-neutral-500 mb-6">
            Your account does not possess the required permissions to access this screen. Please contact your system administrator if you require access.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/dashboard')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
