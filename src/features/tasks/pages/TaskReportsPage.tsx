import { getErrorMessage } from '@/api/client/errorMapper';
import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { DetailSkeleton } from '@/components/feedback/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { tasksConnector } from '@/connectors/tasks.connector';
import { rolesConnector } from '@/connectors/roles.connector';
import {
  TaskSummaryReportData,
  WorkingHoursReportData,
  EmployeePerformanceReportData,
  OverdueTasksReportData,
  ReviewSummaryReportData,
} from '@/api/types/task.types';
import { DepartmentItem } from '@/api/types/roles.types';
import { TaskReportVolumeTab } from '../components/TaskReportVolumeTab';
import { TaskReportHoursTab } from '../components/TaskReportHoursTab';
import { TaskReportPerformanceTab } from '../components/TaskReportPerformanceTab';
import { TaskReportOverdueTab, TaskReportReviewsTab } from '../components/TaskReportOverdueReviewsTab';

export const TaskReportsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'summary' | 'hours' | 'performance' | 'overdue' | 'reviews'>('summary');

  // Filter params
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [departments, setDepartments] = useState<DepartmentItem[]>([]);

  // Report States
  const [summaryReport, setSummaryReport] = useState<TaskSummaryReportData | null>(null);
  const [hoursReport, setHoursReport] = useState<WorkingHoursReportData | null>(null);
  const [perfReport, setPerfReport] = useState<EmployeePerformanceReportData | null>(null);
  const [overdueReport, setOverdueReport] = useState<OverdueTasksReportData | null>(null);
  const [reviewsReport, setReviewsReport] = useState<ReviewSummaryReportData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    rolesConnector.getDepartments({ limit: 100 }).then((res) => setDepartments(res.items || [])).catch(() => {});
  }, []);

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params: Record<string, unknown> = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (selectedDept !== 'ALL') params.departmentId = selectedDept;

      if (activeTab === 'summary') {
        const res = await tasksConnector.getSummaryReport(params);
        setSummaryReport(res);
      } else if (activeTab === 'hours') {
        const res = await tasksConnector.getWorkingHoursReport(params);
        setHoursReport(res);
      } else if (activeTab === 'performance') {
        const res = await tasksConnector.getPerformanceReport(params);
        setPerfReport(res);
      } else if (activeTab === 'overdue') {
        const res = await tasksConnector.getOverdueReport(params);
        setOverdueReport(res);
      } else if (activeTab === 'reviews') {
        const res = await tasksConnector.getReviewsReport(params);
        setReviewsReport(res);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, 'Failed to fetch task reports'));
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, startDate, endDate, selectedDept]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const tabItems: TabItem[] = [
    { id: 'summary', label: 'Volume & Summary' },
    { id: 'hours', label: 'Working Hours & Pauses' },
    { id: 'performance', label: 'Employee Performance' },
    { id: 'overdue', label: 'Overdue SLA Audit' },
    { id: 'reviews', label: 'Review Turnaround' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Date Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Task Intelligence & Reports</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit work hours, employee deliverable throughput, and review turnaround SLA.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-36 text-xs"
          />
          <Input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-36 text-xs"
          />
          <Select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            options={[
              { value: 'ALL', label: 'All Departments' },
              ...departments.map((d) => ({ value: d.id, label: d.name })),
            ]}
            className="w-44 text-xs"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabItems}
        activeTab={activeTab}
        onChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
      />

      {/* Content Area */}
      {isLoading ? (
        <DetailSkeleton />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchReports} />
      ) : (
        <div>
          {activeTab === 'summary' && <TaskReportVolumeTab summaryReport={summaryReport} />}
          {activeTab === 'hours' && <TaskReportHoursTab hoursReport={hoursReport} />}
          {activeTab === 'performance' && <TaskReportPerformanceTab perfReport={perfReport} />}
          {activeTab === 'overdue' && <TaskReportOverdueTab overdueReport={overdueReport} />}
          {activeTab === 'reviews' && <TaskReportReviewsTab reviewsReport={reviewsReport} />}
        </div>
      )}
    </div>
  );
};
