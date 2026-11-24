import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminConnector } from '@/connectors/admin.connector';
import {
  EmployeeActivityItem,
  EmployeeSessionItem,
} from '@/api/types/admin.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminActivityCards } from '../components/AdminActivityCards';
import { AdminActivityTable } from '../components/AdminActivityTable';
import { EmployeeSessionsModal } from '../components/EmployeeSessionsModal';

export const AdminActivityPage: React.FC = () => {
  const defaultFrom = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }, []);
  const defaultTo = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [search, setSearch] = useState('');

  const [activityItems, setActivityItems] = useState<EmployeeActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  // Session History Modal
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeActivityItem | null>(null);
  const [sessions, setSessions] = useState<EmployeeSessionItem[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(false);

  const loadActivity = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminConnector.getEmployeeActivity({
        from: from || undefined,
        to: to || undefined,
        limit: 100,
      });
      const items = res.items || [];
      setActivityItems(items);
      setTotal(res.total ?? res.pagination?.total ?? items.length);
    } catch (err) {
      console.error('Failed to load employee activity:', err);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  const handleViewSessions = async (emp: EmployeeActivityItem) => {
    setSelectedEmployee(emp);
    setLoadingSessions(true);
    const empId = emp.employeeId || emp.id || '';
    try {
      const res = await adminConnector.getEmployeeSessions(empId, {
        from: from || undefined,
        to: to || undefined,
        limit: 50,
      });
      setSessions(res.items || []);
    } catch (err) {
      console.error('Failed to load employee sessions:', err);
      setSessions([]);
    } finally {
      setLoadingSessions(false);
    }
  };

  const filteredItems = activityItems.filter((emp) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = emp.employeeName || emp.name || '';
    const email = emp.email || '';
    const dept = emp.department || '';
    return (
      name.toLowerCase().includes(q) ||
      email.toLowerCase().includes(q) ||
      dept.toLowerCase().includes(q)
    );
  });

  const onlineCount = activityItems.filter((i) => i.status === 'online' || i.isOnline).length;
  const totalSessionsInRange = activityItems.reduce((acc, i) => acc + (i.totalSessions || 0), 0);
  const totalDurationSeconds = activityItems.reduce((acc, i) => acc + (i.totalActiveDurationSeconds || 0), 0);
  const totalHours = Math.round(totalDurationSeconds / 3600);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Organization Activity & Session Audit</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Super Admin real-time monitoring of personnel login activity, online status, device footprints, and duration.
          </p>
        </div>

        {/* Date Range Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-neutral-600 bg-white border border-neutral-200 rounded-lg p-1.5 shadow-xs">
            <span>From:</span>
            <Input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="text-xs py-1 px-2 border-0 focus:ring-0"
            />
            <span>To:</span>
            <Input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="text-xs py-1 px-2 border-0 focus:ring-0"
            />
          </div>
          <Button variant="outline" size="sm" onClick={loadActivity} className="text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
        </div>
      ) : (
        <>
          <AdminActivityCards
            onlineCount={onlineCount}
            totalPersonnel={activityItems.length}
            totalSessionsInRange={totalSessionsInRange}
            totalHours={totalHours}
          />

          <AdminActivityTable
            search={search}
            onSearchChange={setSearch}
            filteredItems={filteredItems}
            total={total}
            onViewSessions={handleViewSessions}
          />
        </>
      )}

      <EmployeeSessionsModal
        selectedEmployee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        sessions={sessions}
        loadingSessions={loadingSessions}
      />
    </div>
  );
};
