import React from 'react';
import { UserDetail } from '@/api/types/users.types';

interface UserProfileTabProps {
  user: UserDetail | null;
}

export const UserProfileTab: React.FC<UserProfileTabProps> = ({ user }) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-slate-900">Type-Specific Profile</h3>
        <p className="text-xs text-slate-500">
          Additional operational attributes for this user profile category.
        </p>
      </div>

      {user?.profile ? (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <pre className="text-xs font-mono text-slate-700 whitespace-pre-wrap">
            {JSON.stringify(user.profile, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="py-8 text-center text-xs text-slate-400 bg-slate-50 rounded-xl border border-slate-200">
          No custom profile data defined for this account type.
        </div>
      )}
    </div>
  );
};
