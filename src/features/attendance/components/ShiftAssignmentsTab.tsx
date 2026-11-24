import React from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ShiftAssignment } from '@/api/types/attendance.types';
import { UserItem } from '@/api/types/users.types';
import { formatDate } from '@/utils/formatters';
import { Edit2, Trash2 } from 'lucide-react';

interface ShiftAssignmentsTabProps {
  usersList: UserItem[];
  selectedUserId: string;
  onSelectedUserIdChange: (userId: string) => void;
  assignments: ShiftAssignment[];
  loadingAssignments: boolean;
  onEditAssignment: (assignment: ShiftAssignment) => void;
  onDeleteAssignment: (assignment: ShiftAssignment) => void;
}

export const ShiftAssignmentsTab: React.FC<ShiftAssignmentsTabProps> = ({
  usersList,
  selectedUserId,
  onSelectedUserIdChange,
  assignments,
  loadingAssignments,
  onEditAssignment,
  onDeleteAssignment,
}) => {
  return (
    <div className="bg-white rounded-xl border border-neutral-200 p-5 shadow-sm space-y-4">
      <div className="max-w-md">
        <Select
          label="Select Employee to View / Manage Shift Assignments"
          value={selectedUserId}
          onChange={(e) => onSelectedUserIdChange(e.target.value)}
          options={usersList.map((u) => ({
            value: u.id,
            label: `${u.name} (${u.email}) ${u.userCode ? `[${u.userCode}]` : ''}`,
          }))}
        />
      </div>

      <div className="border-t border-neutral-200 pt-4">
        <h3 className="text-sm font-semibold text-neutral-900 mb-3">
          Active & Scheduled Assignments
        </h3>
        {loadingAssignments ? (
          <div className="py-6 text-center text-xs text-neutral-500">Loading assignments...</div>
        ) : assignments.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-400">
            No shift assignments found for this employee.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-neutral-200 rounded-lg overflow-hidden">
              <thead className="bg-neutral-50 border-b border-neutral-200 font-semibold text-neutral-700">
                <tr>
                  <th className="py-2.5 px-3">Assigned Shift</th>
                  <th className="py-2.5 px-3">Hours</th>
                  <th className="py-2.5 px-3">Start Date</th>
                  <th className="py-2.5 px-3">End Date</th>
                  <th className="py-2.5 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {assignments.map((assignment) => (
                  <tr key={assignment.id} className="hover:bg-neutral-50/50">
                    <td className="py-2.5 px-3 font-semibold text-neutral-900">
                      {assignment.shiftDefinition?.name || 'Shift'}
                      <span className="block text-[11px] font-mono text-neutral-400">
                        {assignment.shiftDefinition?.code}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {assignment.shiftDefinition?.startTime} - {assignment.shiftDefinition?.endTime}
                    </td>
                    <td className="py-2.5 px-3 text-neutral-700">{formatDate(assignment.startDate)}</td>
                    <td className="py-2.5 px-3 text-neutral-700">
                      {assignment.endDate ? formatDate(assignment.endDate) : 'Ongoing (Indefinite)'}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onEditAssignment(assignment)}
                          leftIcon={<Edit2 className="w-3 h-3" />}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => onDeleteAssignment(assignment)}
                          leftIcon={<Trash2 className="w-3 h-3" />}
                        >
                          Remove
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
