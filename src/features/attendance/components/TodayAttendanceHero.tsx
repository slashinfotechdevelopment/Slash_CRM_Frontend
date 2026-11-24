import React from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TodayAttendanceResponse, ShiftAssignment } from '@/api/types/attendance.types';
import { formatTime, formatDurationSeconds } from '@/utils/formatters';
import { LogIn, LogOut, Coffee, Play, Clock } from 'lucide-react';

interface TodayAttendanceHeroProps {
  todayData: TodayAttendanceResponse | null;
  myAssignments: ShiftAssignment[];
  liveDuration: number;
  isSubmitting: boolean;
  onCheckInOpen: () => void;
  onCheckOutOpen: () => void;
  onStartBreakOpen: () => void;
  onEndBreak: () => void;
}

export const TodayAttendanceHero: React.FC<TodayAttendanceHeroProps> = ({
  todayData,
  myAssignments,
  liveDuration,
  isSubmitting,
  onCheckInOpen,
  onCheckOutOpen,
  onStartBreakOpen,
  onEndBreak,
}) => {
  const activeShift = todayData?.effectiveShift || myAssignments[0]?.shiftDefinition;

  return (
    <div className="bg-white rounded-xl border border-neutral-200/80 p-5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            Today's Attendance Status
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Authoritative server timestamp tracking with IST shift boundaries
          </p>
        </div>

        <div className="flex items-center gap-2">
          {todayData?.hasActiveSession ? (
            todayData?.hasActiveBreak ? (
              <Button
                variant="primary"
                size="sm"
                onClick={onEndBreak}
                isLoading={isSubmitting}
                leftIcon={<Play className="w-4 h-4" />}
              >
                End Break
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onStartBreakOpen}
                  leftIcon={<Coffee className="w-4 h-4" />}
                >
                  Take Break
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={onCheckOutOpen}
                  leftIcon={<LogOut className="w-4 h-4" />}
                >
                  Check Out
                </Button>
              </>
            )
          ) : (
            <Button
              variant="primary"
              size="sm"
              onClick={onCheckInOpen}
              leftIcon={<LogIn className="w-4 h-4" />}
            >
              Check In
            </Button>
          )}
        </div>
      </div>

      {/* Live Status Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <div className="bg-neutral-50/80 rounded-lg p-3 border border-neutral-200/60">
          <span className="text-xs text-neutral-500 font-medium">Session State</span>
          <div className="mt-1 flex items-center gap-2">
            {todayData?.hasActiveSession ? (
              todayData?.hasActiveBreak ? (
                <Badge variant="warning">On Break</Badge>
              ) : (
                <Badge variant="success">Currently Working</Badge>
              )
            ) : (
              <Badge variant="neutral">Not Checked In</Badge>
            )}
          </div>
        </div>

        <div className="bg-neutral-50/80 rounded-lg p-3 border border-neutral-200/60">
          <span className="text-xs text-neutral-500 font-medium">Live Active Duration</span>
          <div className="mt-1 text-base font-bold text-neutral-900 tracking-tight font-mono">
            {todayData?.hasActiveSession ? formatDurationSeconds(liveDuration) : '00:00:00'}
          </div>
        </div>

        <div className="bg-neutral-50/80 rounded-lg p-3 border border-neutral-200/60">
          <span className="text-xs text-neutral-500 font-medium">Today's Check In</span>
          <div className="mt-1 text-sm font-semibold text-neutral-800">
            {todayData?.activeSession?.checkInTimeFormatted ||
              (todayData?.activeSession?.checkInAt ? formatTime(todayData.activeSession.checkInAt) : '—')}
          </div>
        </div>

        <div className="bg-neutral-50/80 rounded-lg p-3 border border-neutral-200/60">
          <span className="text-xs text-neutral-500 font-medium">Assigned Shift</span>
          <div className="mt-1 text-sm font-semibold text-neutral-800 truncate">
            {activeShift ? (
              <span>
                {activeShift.name} ({activeShift.startTime} - {activeShift.endTime})
              </span>
            ) : (
              'Standard Shift'
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
