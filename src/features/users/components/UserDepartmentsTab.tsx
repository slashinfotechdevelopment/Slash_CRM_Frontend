import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { UserDetail } from '@/api/types/users.types';
import { Building2 } from 'lucide-react';

interface UserDepartmentsTabProps {
  user: UserDetail | null;
  isDeleted: boolean;
  onOpenDepartmentsModal: () => void;
}

export const UserDepartmentsTab: React.FC<UserDepartmentsTabProps> = ({
  user,
  isDeleted,
  onOpenDepartmentsModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-900">Assigned Departments</h3>
          <p className="text-xs text-slate-500">
            Departments define resource access, ticket assignments, and data scoping.
          </p>
        </div>
        {!isDeleted && (
          <Button
            variant="primary"
            size="sm"
            onClick={onOpenDepartmentsModal}
            className="flex items-center gap-1.5 text-xs"
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Configure Departments</span>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {user?.departments?.length === 0 ? (
          <div className="col-span-2 py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
            No departments assigned yet. Click 'Configure Departments' to assign.
          </div>
        ) : (
          user?.departments?.map((dept) => (
            <div
              key={dept.id || dept.code}
              className="p-5 bg-white border border-slate-200 rounded-xl flex items-start justify-between gap-4 shadow-sm"
            >
              <div className="space-y-1.5 min-w-0">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-brand-primary" />
                  <span className="font-bold text-slate-900 text-sm truncate">{dept.name}</span>
                  {dept.isPrimary && (
                    <Badge variant="success" size="sm">
                      Primary Department
                    </Badge>
                  )}
                </div>
                <p className="text-xs font-mono text-slate-500">{dept.code}</p>
                {dept.description && (
                  <p className="text-xs text-slate-600 line-clamp-2">{dept.description}</p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
