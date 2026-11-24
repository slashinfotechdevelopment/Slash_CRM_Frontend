import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, TabItem } from '@/components/ui/Tabs';
import { DetailSkeleton } from '@/components/feedback/Skeleton';
import { ErrorState } from '@/components/feedback/ErrorState';
import { tasksConnector } from '@/connectors/tasks.connector';
import {
  EmployeeDashboardData,
  TeamDashboardData,
  OrgDashboardData,
} from '@/api/types/task.types';
import { TaskMyDashboardTab } from '../components/TaskMyDashboardTab';
import { TaskTeamDashboardTab } from '../components/TaskTeamDashboardTab';
import { TaskOrgDashboardTab } from '../components/TaskOrgDashboardTab';

export const TaskDashboardsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my' | 'team' | 'org'>('my');

  const [empData, setEmpData] = useState<EmployeeDashboardData | null>(null);
  const [teamData, setTeamData] = useState<TeamDashboardData | null>(null);
  const [orgData, setOrgData] = useState<OrgDashboardData | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (activeTab === 'my') {
        const res = await tasksConnector.getEmployeeDashboard();
        setEmpData(res);
      } else if (activeTab === 'team') {
        const res = await tasksConnector.getTeamDashboard();
        setTeamData(res);
      } else if (activeTab === 'org') {
        const res = await tasksConnector.getOrgDashboard();
        setOrgData(res);
      }
    } catch (err: unknown) {
      setError((err as Error).message || 'Failed to fetch task metrics');
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const tabItems: TabItem[] = [
    { id: 'my', label: 'Personal Workspace' },
    { id: 'team', label: 'Team Management' },
    { id: 'org', label: 'Organization Overview' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Task Performance Dashboards</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor personal deliverables, department velocity, and enterprise task health.
        </p>
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
        <ErrorState message={error} onRetry={fetchDashboardData} />
      ) : (
        <div>
          {activeTab === 'my' && <TaskMyDashboardTab empData={empData} />}
          {activeTab === 'team' && <TaskTeamDashboardTab teamData={teamData} />}
          {activeTab === 'org' && <TaskOrgDashboardTab orgData={orgData} />}
        </div>
      )}
    </div>
  );
};
