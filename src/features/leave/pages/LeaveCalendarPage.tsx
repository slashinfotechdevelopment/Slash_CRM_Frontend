import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { leaveConnector } from '@/connectors/leave.connector';
import { departmentsConnector } from '@/connectors/departments.connector';
import { LeaveCalendarItem } from '@/api/types/leave.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LeaveCalendarDayModal } from '../components/LeaveCalendarDayModal';

export const LeaveCalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [departmentId, setDepartmentId] = useState<string>('ALL');
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);
  const [calendarItems, setCalendarItems] = useState<LeaveCalendarItem[]>([]);

  // Selected Day Details Modal
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ dateStr: string; items: LeaveCalendarItem[] } | null>(null);

  // Month Bounds
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const startOfMonth = useMemo(() => new Date(year, month, 1), [year, month]);
  const endOfMonth = useMemo(() => new Date(year, month + 1, 0), [year, month]);

  const startDateStr = useMemo(() => {
    return startOfMonth.toISOString().split('T')[0];
  }, [startOfMonth]);

  const endDateStr = useMemo(() => {
    return endOfMonth.toISOString().split('T')[0];
  }, [endOfMonth]);

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Load departments
  useEffect(() => {
    departmentsConnector.getDepartments({ limit: 100 }).then((res) => {
      setDepartments(res.items || []);
    }).catch(console.error);
  }, []);

  // Load calendar items for month
  const loadCalendar = useCallback(async () => {
    try {
      const items = await leaveConnector.getLeaveCalendar({
        startDate: startDateStr,
        endDate: endDateStr,
        departmentId: departmentId === 'ALL' ? undefined : departmentId,
      });
      setCalendarItems(items);
    } catch (err) {
      console.error('Failed to load leave calendar:', err);
    }
  }, [startDateStr, endDateStr, departmentId]);

  useEffect(() => {
    loadCalendar();
  }, [loadCalendar]);

  // Navigate months
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Build calendar matrix (42 cells: 6 weeks x 7 days)
  const calendarDays = useMemo(() => {
    const days: Array<{ date: Date; dateStr: string; isCurrentMonth: boolean }> = [];
    const firstDayIndex = startOfMonth.getDay(); // 0 = Sun, 1 = Mon ...
    const prevMonthDays = new Date(year, month, 0).getDate();

    // Previous month filler days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        isCurrentMonth: false,
      });
    }

    // Current month days
    const totalDaysInMonth = endOfMonth.getDate();
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const d = new Date(year, month, i);
      days.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        isCurrentMonth: true,
      });
    }

    // Next month filler days to complete rows
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        date: d,
        dateStr: d.toISOString().split('T')[0],
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month, startOfMonth, endOfMonth]);

  // Map events to dateStr
  const eventsByDate = useMemo(() => {
    const map = new Map<string, LeaveCalendarItem[]>();
    for (const item of calendarItems) {
      // expand date range
      const start = new Date(item.startDate);
      const end = new Date(item.endDate);
      for (let cur = new Date(start); cur <= end; cur.setDate(cur.getDate() + 1)) {
        const dStr = cur.toISOString().split('T')[0];
        const list = map.get(dStr) || [];
        list.push(item);
        map.set(dStr, list);
      }
    }
    return map;
  }, [calendarItems]);

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Enterprise Leave Calendar</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Visual month overview of scheduled employee leaves, team coverage, and holiday planning.
          </p>
        </div>

        {/* Month Navigation & Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-48">
            <Select
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
              options={[
                { label: 'All Departments', value: 'ALL' },
                ...departments.map((d) => ({ label: d.name, value: d.id })),
              ]}
              className="text-xs"
            />
          </div>
          <div className="flex items-center gap-1 bg-white border border-neutral-200 rounded-lg p-1 shadow-sm">
            <Button variant="ghost" size="sm" onClick={handlePrevMonth} className="px-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleToday} className="text-xs font-semibold px-2">
              Today
            </Button>
            <Button variant="ghost" size="sm" onClick={handleNextMonth} className="px-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Month Label */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-neutral-900">
          {monthName} {year}
        </h2>
        <div className="text-xs text-neutral-500">
          {calendarItems.length} active leaves scheduled this month
        </div>
      </div>

      {/* Calendar Grid Container */}
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-600 text-center py-2.5">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 divide-x divide-y divide-neutral-200">
          {calendarDays.map((day, idx) => {
            const dayEvents = eventsByDate.get(day.dateStr) || [];
            const isToday = day.dateStr === todayStr;

            return (
              <div
                key={idx}
                onClick={() => {
                  if (dayEvents.length > 0) {
                    setSelectedDayEvents({ dateStr: day.dateStr, items: dayEvents });
                  }
                }}
                className={`min-h-[90px] sm:min-h-[110px] p-2 flex flex-col justify-between transition-colors ${
                  !day.isCurrentMonth
                    ? 'bg-neutral-50/50 text-neutral-400'
                    : isToday
                    ? 'bg-primary-50/20'
                    : 'bg-white hover:bg-neutral-50/40'
                } ${dayEvents.length > 0 ? 'cursor-pointer' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday
                        ? 'bg-primary-600 text-white'
                        : day.isCurrentMonth
                        ? 'text-neutral-800'
                        : 'text-neutral-400'
                    }`}
                  >
                    {day.date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-[10px] font-bold text-primary-600 bg-primary-100 rounded-full px-1.5 py-0.2">
                      {dayEvents.length}
                    </span>
                  )}
                </div>

                {/* Day events pills preview */}
                <div className="space-y-1 mt-1 overflow-hidden">
                  {dayEvents.slice(0, 2).map((ev, i) => (
                    <div
                      key={i}
                      className="text-[11px] truncate px-1.5 py-0.5 rounded font-medium bg-amber-50 text-amber-800 border border-amber-200"
                      title={`${ev.userName} (${ev.leaveTypeName})`}
                    >
                      {ev.userName}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-[10px] text-neutral-500 font-medium px-1">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Events Details Modal */}
      <LeaveCalendarDayModal
        selectedDayEvents={selectedDayEvents}
        onClose={() => setSelectedDayEvents(null)}
      />
    </div>
  );
};
