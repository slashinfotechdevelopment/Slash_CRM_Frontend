import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Holiday, WorkCalendarScope } from '@/api/types/leave.types';

interface HolidayModalsProps {
  isHolidayModalOpen: boolean;
  onCloseHoliday: () => void;
  editingHoliday: Holiday | null;
  holidayForm: {
    name: string;
    date: string;
    description: string;
    isOptional: boolean;
    scopeType: WorkCalendarScope;
  };
  setHolidayForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      date: string;
      description: string;
      isOptional: boolean;
      scopeType: WorkCalendarScope;
    }>
  >;
  isSubmittingHoliday: boolean;
  holidayError: string | null;
  onSaveHoliday: () => Promise<void>;

  isWeeklyOffModalOpen: boolean;
  onCloseWeeklyOff: () => void;
  weeklyOffForm: {
    name: string;
    description: string;
    daysOfWeek: number[];
    pattern: string;
    effectiveFrom: string;
  };
  setWeeklyOffForm: React.Dispatch<
    React.SetStateAction<{
      name: string;
      description: string;
      daysOfWeek: number[];
      pattern: string;
      effectiveFrom: string;
    }>
  >;
  isSubmittingWeeklyOff: boolean;
  weeklyOffError: string | null;
  onSaveWeeklyOff: () => Promise<void>;
}

export const HolidayModals: React.FC<HolidayModalsProps> = ({
  isHolidayModalOpen,
  onCloseHoliday,
  editingHoliday,
  holidayForm,
  setHolidayForm,
  isSubmittingHoliday,
  holidayError,
  onSaveHoliday,
  isWeeklyOffModalOpen,
  onCloseWeeklyOff,
  weeklyOffForm,
  setWeeklyOffForm,
  isSubmittingWeeklyOff,
  weeklyOffError,
  onSaveWeeklyOff,
}) => {
  const getDayName = (d: number) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[d] || `Day ${d}`;
  };

  return (
    <>
      {/* Add / Edit Holiday Modal */}
      <FormModal
        isOpen={isHolidayModalOpen}
        onClose={onCloseHoliday}
        title={editingHoliday ? `Edit Holiday: ${editingHoliday.name}` : 'Add Company Holiday'}
        onSubmit={onSaveHoliday}
        isSubmitting={isSubmittingHoliday}
        submitLabel={editingHoliday ? 'Save Changes' : 'Create Holiday'}
      >
        <div className="space-y-4 text-xs">
          {holidayError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {holidayError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Holiday Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={holidayForm.name}
              onChange={(e) => setHolidayForm({ ...holidayForm, name: e.target.value })}
              placeholder="e.g. Independence Day, Diwali, Christmas"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Date <span className="text-red-500">*</span>
            </label>
            <Input
              type="date"
              value={holidayForm.date}
              onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Scope</label>
            <Select
              value={holidayForm.scopeType}
              onChange={(e) => setHolidayForm({ ...holidayForm, scopeType: e.target.value as WorkCalendarScope })}
              options={[
                { label: 'Global (All Organization)', value: 'GLOBAL' },
                { label: 'Location Specific', value: 'LOCATION' },
                { label: 'Department Specific', value: 'DEPARTMENT' },
              ]}
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isOptional"
              checked={holidayForm.isOptional}
              onChange={(e) => setHolidayForm({ ...holidayForm, isOptional: e.target.checked })}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-4 w-4"
            />
            <label htmlFor="isOptional" className="text-xs font-medium text-neutral-800 cursor-pointer">
              Optional / Restricted Holiday (Employees can elect to take)
            </label>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Description / Notes</label>
            <textarea
              value={holidayForm.description}
              onChange={(e) => setHolidayForm({ ...holidayForm, description: e.target.value })}
              rows={2}
              placeholder="Cultural or official background..."
              className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </FormModal>

      {/* Create Weekly Off Policy Modal */}
      <FormModal
        isOpen={isWeeklyOffModalOpen}
        onClose={onCloseWeeklyOff}
        title="Create Weekly-Off Policy"
        onSubmit={onSaveWeeklyOff}
        isSubmitting={isSubmittingWeeklyOff}
        submitLabel="Create Policy"
      >
        <div className="space-y-4 text-xs">
          {weeklyOffError && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {weeklyOffError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Policy Name <span className="text-red-500">*</span>
            </label>
            <Input
              value={weeklyOffForm.name}
              onChange={(e) => setWeeklyOffForm({ ...weeklyOffForm, name: e.target.value })}
              placeholder="e.g. Standard 5-Day Workweek"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">
              Select Weekly-Off Days <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {[0, 1, 2, 3, 4, 5, 6].map((dayIdx) => {
                const isSelected = weeklyOffForm.daysOfWeek.includes(dayIdx);
                return (
                  <label key={dayIdx} className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const next = checked
                          ? [...weeklyOffForm.daysOfWeek, dayIdx]
                          : weeklyOffForm.daysOfWeek.filter((d) => d !== dayIdx);
                        setWeeklyOffForm({ ...weeklyOffForm, daysOfWeek: next });
                      }}
                      className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500 h-3.5 w-3.5"
                    />
                    <span>{getDayName(dayIdx)}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Pattern</label>
              <Select
                value={weeklyOffForm.pattern}
                onChange={(e) => setWeeklyOffForm({ ...weeklyOffForm, pattern: e.target.value })}
                options={[
                  { label: 'All Weeks (e.g. Every Saturday & Sunday)', value: 'ALL' },
                  { label: 'Alternate (2nd & 4th Saturdays)', value: 'ALTERNATE_SATURDAYS' },
                ]}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Effective From</label>
              <Input
                type="date"
                value={weeklyOffForm.effectiveFrom}
                onChange={(e) => setWeeklyOffForm({ ...weeklyOffForm, effectiveFrom: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1">Description</label>
            <textarea
              value={weeklyOffForm.description}
              onChange={(e) => setWeeklyOffForm({ ...weeklyOffForm, description: e.target.value })}
              rows={2}
              className="w-full text-xs p-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>
      </FormModal>
    </>
  );
};
