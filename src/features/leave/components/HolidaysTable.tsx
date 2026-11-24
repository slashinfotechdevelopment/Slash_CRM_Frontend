import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Holiday } from '@/api/types/leave.types';

interface HolidaysTableProps {
  holidays: Holiday[];
  loading: boolean;
  selectedYear: number;
  onYearChange: (year: number) => void;
  onEdit: (h: Holiday) => void;
  onDelete: (h: Holiday) => void;
}

export const HolidaysTable: React.FC<HolidaysTableProps> = ({
  holidays,
  loading,
  selectedYear,
  onYearChange,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="space-y-4">
      {/* Year selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-neutral-600">Select Year:</span>
          <div className="w-32">
            <Select
              value={String(selectedYear)}
              onChange={(e) => onYearChange(Number(e.target.value))}
              options={[
                { label: '2025', value: '2025' },
                { label: '2026', value: '2026' },
                { label: '2027', value: '2027' },
              ]}
              className="text-xs"
            />
          </div>
        </div>
        <div className="text-xs text-neutral-500 font-medium">
          {holidays.length} total holidays configured for {selectedYear}
        </div>
      </div>

      {/* Holidays Table */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-neutral-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : holidays.length === 0 ? (
          <div className="p-12 text-center text-neutral-500">
            <p className="font-medium text-neutral-700">No holidays configured for {selectedYear}</p>
            <p className="text-xs text-neutral-400 mt-1">
              Click "Sync Google Calendar" to pull government gazetted holidays automatically, or click "Add Holiday".
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600 font-semibold border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Holiday Name</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Scope</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {holidays.map((h) => (
                  <tr key={h.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-neutral-800 font-semibold">
                      {h.dateFormatted || h.date}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">{h.name}</td>
                    <td className="py-3 px-4">
                      <Badge variant={h.isOptional ? 'neutral' : 'success'}>
                        {h.isOptional ? 'Restricted / Optional' : 'Public Holiday'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-600 font-medium">
                      {h.scopeType}
                    </td>
                    <td className="py-3 px-4 text-xs text-neutral-500 max-w-xs truncate" title={h.description || ''}>
                      {h.description || '-'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      {h.googleCalendarUrl && (
                        <a
                          href={h.googleCalendarUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primary-600 hover:text-primary-800 font-semibold inline-block"
                        >
                          + Google Cal
                        </a>
                      )}
                      <Button variant="ghost" size="sm" onClick={() => onEdit(h)} className="text-xs">
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(h)}
                        className="text-xs"
                      >
                        Delete
                      </Button>
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
