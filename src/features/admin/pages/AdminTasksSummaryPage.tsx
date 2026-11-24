import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { adminConnector } from '@/connectors/admin.connector';
import {
  EmployeeTaskSummaryItem,
  EmployeeTaskItem,
} from '@/api/types/admin.types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AdminTasksSummaryCards } from '../components/AdminTasksSummaryCards';
import { AdminEmployeeTasksTable } from '../components/AdminEmployeeTasksTable';
import { EmployeeTaskInspectionModal } from '../components/EmployeeTaskInspectionModal';

export const AdminTasksSummaryPage: React.FC = () => {
  const defaultFrom = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split('T')[0];
  }, []);
  const defaultTo = useMemo(() => new Date().toISOString().split('T')[0], []);

  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [summaryList, setSummaryList] = useState<EmployeeTaskSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Single Employee Inspection Modal
  const [inspectEmployee, setInspectEmployee] = useState<EmployeeTaskSummaryItem | null>(null);
  const [employeeTasks, setEmployeeTasks] = useState<EmployeeTaskItem[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(false);

  const loadSummary = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminConnector.getTasksSummary({
        from: from || undefined,
        to: to || undefined,
      });
      setSummaryList(res.summary || []);
    } catch (err) {
      console.error('Failed to load admin tasks summary:', err);
    } finally {
      setLoading(false);
    }
  }, [from, to]);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  const handleInspectTasks = async (item: EmployeeTaskSummaryItem) => {
    setInspectEmployee(item);
    setLoadingTasks(true);
    const empId = item.employeeId || item.employee?.id || '';
    try {
      const res = await adminConnector.getEmployeeTasks(empId, {
        from: from || undefined,
        to: to || undefined,
        limit: 50,
      });
      setEmployeeTasks(res.items || []);
    } catch (err) {
      console.error('Failed to load employee tasks:', err);
      setEmployeeTasks([]);
    } finally {
      setLoadingTasks(false);
    }
  };

  const totalTasks = summaryList.reduce((acc, s) => acc + (s.totalTasks ?? s.total ?? 0), 0);
  const totalCompleted = summaryList.reduce((acc, s) => acc + (s.completedTasks ?? s.completed ?? 0), 0);
  const totalPending = summaryList.reduce((acc, s) => acc + (s.pendingTasks ?? s.pending ?? 0), 0);
  const totalOverdue = summaryList.reduce((acc, s) => acc + (s.overdueTasks ?? s.overdue ?? 0), 0);
  const orgCompletionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Executive Task & Deliverable Velocity</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Super Admin cross-department deliverables audit, employee task throughput, and SLA breach oversight.
          </p>
        </div>

        {/* Date Filter Controls */}
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
          <Button variant="outline" size="sm" onClick={loadSummary} className="text-xs">
            Refresh
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-neutral-100 rounded-xl animate-pulse" />
            ))}
          </div>
          <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
        </div>
      ) : (
        <>
          <AdminTasksSummaryCards
            totalTasks={totalTasks}
            totalCompleted={totalCompleted}
            totalPending={totalPending}
            totalOverdue={totalOverdue}
            orgCompletionRate={orgCompletionRate}
          />

          <AdminEmployeeTasksTable
            summaryList={summaryList}
            onInspect={handleInspectTasks}
          />
        </>
      )}

      <EmployeeTaskInspectionModal
        inspectEmployee={inspectEmployee}
        onClose={() => setInspectEmployee(null)}
        employeeTasks={employeeTasks}
        loadingTasks={loadingTasks}
      />
    </div>
  );
};
