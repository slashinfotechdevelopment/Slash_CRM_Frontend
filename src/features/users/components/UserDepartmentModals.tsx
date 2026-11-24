import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { UserDetail } from '@/api/types/users.types';
import { DepartmentItem } from '@/api/types/roles.types';

export interface UserDepartmentModalsProps {
  user: UserDetail | null;
  formError: string | null;
  isSubmitting: boolean;

  // Departments
  isDepartmentsModalOpen: boolean;
  onCloseDepartments: () => void;
  deptAssignments: { id: string; isPrimary: boolean }[];
  setDeptAssignments: React.Dispatch<
    React.SetStateAction<{ id: string; isPrimary: boolean }[]>
  >;
  availableDepartments: DepartmentItem[];
  onDepartmentsSubmit: (e: React.FormEvent) => void;
}

export const UserDepartmentModals: React.FC<UserDepartmentModalsProps> = ({
  user,
  formError,
  isSubmitting,
  isDepartmentsModalOpen,
  onCloseDepartments,
  deptAssignments,
  setDeptAssignments,
  availableDepartments,
  onDepartmentsSubmit,
}) => {
  return (
    <FormModal
      isOpen={isDepartmentsModalOpen}
      onClose={onCloseDepartments}
      title="Configure Department Memberships"
      subtitle={`Assign departments for ${user?.name}. Exactly one department must be marked as primary.`}
      errorMessage={formError}
      isSubmitting={isSubmitting}
      submitLabel="Save Departments"
      onSubmit={onDepartmentsSubmit}
    >
      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
        {availableDepartments.map((dept) => {
          const assignment = deptAssignments.find((a) => a.id === dept.id);
          const isSelected = !!assignment;
          const isPrimary = assignment?.isPrimary || false;
          return (
            <div
              key={dept.id}
              className={`p-3 rounded-lg border flex items-center justify-between gap-3 ${
                isSelected ? 'border-brand-primary bg-brand-primary/5' : 'border-slate-200 bg-white'
              }`}
            >
              <label className="flex items-center gap-3 cursor-pointer min-w-0 flex-1">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-brand-primary focus:ring-brand-primary"
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      const hasPrimary = deptAssignments.some((a) => a.isPrimary);
                      setDeptAssignments((prev) => [
                        ...prev,
                        { id: dept.id, isPrimary: !hasPrimary },
                      ]);
                    } else {
                      setDeptAssignments((prev) => prev.filter((a) => a.id !== dept.id));
                    }
                  }}
                />
                <div className="min-w-0">
                  <div className="font-semibold text-xs text-slate-900 truncate">{dept.name}</div>
                  <div className="font-mono text-[11px] text-slate-500">{dept.code}</div>
                </div>
              </label>
              {isSelected && (
                <button
                  type="button"
                  onClick={() => {
                    setDeptAssignments((prev) =>
                      prev.map((a) => ({ ...a, isPrimary: a.id === dept.id }))
                    );
                  }}
                  className={`px-2 py-1 text-[11px] font-semibold rounded ${
                    isPrimary
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {isPrimary ? 'Primary' : 'Make Primary'}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </FormModal>
  );
};
