import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/app/layout/AppLayout';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { LoginPage } from '@/features/auth/pages/LoginPage';
import { SetupPage } from '@/features/auth/pages/SetupPage';
import { PublicInquiryPage } from '@/features/leads/pages/PublicInquiryPage';
import { DashboardPage } from '@/features/admin/pages/DashboardPage';
import { RolesListPage } from '@/features/roles/pages/RolesListPage';
import { RoleDetailPage } from '@/features/roles/pages/RoleDetailPage';
import { PermissionsListPage } from '@/features/permissions/pages/PermissionsListPage';
import { DepartmentsListPage } from '@/features/departments/pages/DepartmentsListPage';
import { UsersListPage } from '@/features/users/pages/UsersListPage';
import { UserDetailPage } from '@/features/users/pages/UserDetailPage';
import { MyAttendancePage } from '@/features/attendance/pages/MyAttendancePage';
import { TeamAttendancePage } from '@/features/attendance/pages/TeamAttendancePage';
import { ShiftsPage } from '@/features/attendance/pages/ShiftsPage';
import { WfhRequestsPage } from '@/features/attendance/pages/WfhRequestsPage';
import { OvertimeRequestsPage } from '@/features/attendance/pages/OvertimeRequestsPage';
import { CorrectionsPage } from '@/features/attendance/pages/CorrectionsPage';
import { AnomaliesPage } from '@/features/attendance/pages/AnomaliesPage';
import { ReconciliationPage } from '@/features/attendance/pages/ReconciliationPage';
import { TasksListPage } from '@/features/tasks/pages/TasksListPage';
import { MyTasksPage } from '@/features/tasks/pages/MyTasksPage';
import { TaskDetailPage } from '@/features/tasks/pages/TaskDetailPage';
import { TaskDashboardsPage } from '@/features/tasks/pages/TaskDashboardsPage';
import { TaskReportsPage } from '@/features/tasks/pages/TaskReportsPage';
import { LeadsListPage } from '@/features/leads/pages/LeadsListPage';
import { LeadDetailPage } from '@/features/leads/pages/LeadDetailPage';
import { LeadPipelinePage } from '@/features/leads/pages/LeadPipelinePage';
import { LeadFollowUpsPage } from '@/features/leads/pages/LeadFollowUpsPage';
import { MyLeavePage } from '@/features/leave/pages/MyLeavePage';
import { LeaveApprovalsPage } from '@/features/leave/pages/LeaveApprovalsPage';
import { LeaveBalancesPage } from '@/features/leave/pages/LeaveBalancesPage';
import { LeaveCalendarPage } from '@/features/leave/pages/LeaveCalendarPage';
import { HolidaysPage } from '@/features/leave/pages/HolidaysPage';
import { LeaveSetupPage } from '@/features/leave/pages/LeaveSetupPage';
import { LeaveReportsPage } from '@/features/leave/pages/LeaveReportsPage';
import { AdminActivityPage } from '@/features/admin/pages/AdminActivityPage';
import { AdminTasksSummaryPage } from '@/features/admin/pages/AdminTasksSummaryPage';
import { AdminLeadsExecutivePage } from '@/features/admin/pages/AdminLeadsExecutivePage';
import { TemplateShowcasePage } from '@/features/dev/TemplateShowcasePage';
import { TableSkeleton } from '@/components/feedback/Skeleton';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-50">
        <div className="w-full max-w-xl">
          <TableSkeleton rows={4} columns={3} />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/inquire" element={<PublicInquiryPage />} />

      {/* Protected App Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        {/* Roles, Permissions & Departments */}
        <Route
          path="roles"
          element={
            <PermissionGuard required="roles.view">
              <RolesListPage />
            </PermissionGuard>
          }
        />
        <Route
          path="roles/:id"
          element={
            <PermissionGuard required="roles.view">
              <RoleDetailPage />
            </PermissionGuard>
          }
        />
        <Route
          path="permissions"
          element={
            <PermissionGuard required="permissions.view">
              <PermissionsListPage />
            </PermissionGuard>
          }
        />
        <Route
          path="departments"
          element={
            <PermissionGuard required="departments.view">
              <DepartmentsListPage />
            </PermissionGuard>
          }
        />

        {/* UI Verification Showcase (Dev Only) */}
        {import.meta.env.DEV && <Route path="dev/showcase" element={<TemplateShowcasePage />} />}

        {/* Attendance & Shifts */}
        <Route path="attendance" element={<Navigate to="/attendance/my" replace />} />
        <Route path="attendance/my" element={<MyAttendancePage />} />
        <Route
          path="attendance/team"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER']}
              required="attendance.view"
              fallback={<Navigate to="/attendance/my" replace />}
            >
              <TeamAttendancePage />
            </PermissionGuard>
          }
        />
        <Route
          path="attendance/shifts"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR']}
              required="attendance.manage_shifts"
              fallback={<Navigate to="/attendance/my" replace />}
            >
              <ShiftsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="attendance/wfh"
          element={
            <PermissionGuard required={['attendance.view_wfh', 'attendance.request_wfh', 'attendance.approve_wfh']}>
              <WfhRequestsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="attendance/overtime"
          element={
            <PermissionGuard required={['attendance.view_overtime', 'attendance.request_overtime', 'attendance.approve_overtime']}>
              <OvertimeRequestsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="attendance/corrections"
          element={
            <PermissionGuard required={['attendance.correct_own', 'attendance.review_correction']}>
              <CorrectionsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="attendance/anomalies"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR']}
              required="attendance.view_anomalies"
              fallback={<Navigate to="/attendance/my" replace />}
            >
              <AnomaliesPage />
            </PermissionGuard>
          }
        />
        <Route
          path="attendance/reconciliation"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR']}
              required="attendance.reconcile"
              fallback={<Navigate to="/attendance/my" replace />}
            >
              <ReconciliationPage />
            </PermissionGuard>
          }
        />

        {/* Tasks & Kanban Management */}
        <Route
          path="tasks"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER']}
              required={['tasks.assign', 'tasks.create']}
              fallback={<Navigate to="/tasks/my" replace />}
            >
              <TasksListPage />
            </PermissionGuard>
          }
        />
        <Route
          path="tasks/my"
          element={
            <PermissionGuard required={['tasks.view_own', 'tasks.view']}>
              <MyTasksPage />
            </PermissionGuard>
          }
        />
        <Route
          path="tasks/dashboards"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER']}
              required={['reports.view', 'tasks.view']}
              fallback={<Navigate to="/tasks/my" replace />}
            >
              <TaskDashboardsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="tasks/reports"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER']}
              required="reports.view"
              fallback={<Navigate to="/tasks/my" replace />}
            >
              <TaskReportsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="tasks/:id"
          element={
            <PermissionGuard required={['tasks.view', 'tasks.view_own']}>
              <TaskDetailPage />
            </PermissionGuard>
          }
        />

        {/* Leads & CRM Pipeline */}
        <Route
          path="leads"
          element={
            <PermissionGuard required="leads.view">
              <LeadsListPage />
            </PermissionGuard>
          }
        />
        <Route
          path="leads/pipeline"
          element={
            <PermissionGuard required="leads.view">
              <LeadPipelinePage />
            </PermissionGuard>
          }
        />
        <Route
          path="leads/follow-ups"
          element={
            <PermissionGuard required="leads.view">
              <LeadFollowUpsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="leads/:id"
          element={
            <PermissionGuard required="leads.view">
              <LeadDetailPage />
            </PermissionGuard>
          }
        />

        {/* Leave & Absence Management */}
        <Route path="leave" element={<Navigate to="/leave/my" replace />} />
        <Route path="leave/my" element={<MyLeavePage />} />
        <Route
          path="leave/approvals"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER']}
              required={['leave.view_requests', 'leave.approve']}
              fallback={<Navigate to="/leave/my" replace />}
            >
              <LeaveApprovalsPage />
            </PermissionGuard>
          }
        />
        <Route
          path="leave/balances"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR']}
              required="leave.view_balances"
              fallback={<Navigate to="/leave/my" replace />}
            >
              <LeaveBalancesPage />
            </PermissionGuard>
          }
        />
        <Route
          path="leave/calendar"
          element={
            <PermissionGuard required={['leave.view_requests', 'leave.view']}>
              <LeaveCalendarPage />
            </PermissionGuard>
          }
        />
        <Route
          path="leave/holidays"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR']}
              required={['leave.manage_holidays', 'leave.manage_weekly_offs']}
              fallback={<Navigate to="/leave/my" replace />}
            >
              <HolidaysPage />
            </PermissionGuard>
          }
        />
        <Route
          path="leave/setup"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR']}
              required={['leave.manage_types', 'leave.manage_policies']}
              fallback={<Navigate to="/leave/my" replace />}
            >
              <LeaveSetupPage />
            </PermissionGuard>
          }
        />
        <Route
          path="leave/reports"
          element={
            <PermissionGuard
              role={['ADMIN', 'SUPER_ADMIN', 'HR']}
              required="leave.view_reports"
              fallback={<Navigate to="/leave/my" replace />}
            >
              <LeaveReportsPage />
            </PermissionGuard>
          }
        />

        {/* Users & Organization */}
        <Route
          path="users"
          element={
            <PermissionGuard required="users.view">
              <UsersListPage />
            </PermissionGuard>
          }
        />
        <Route
          path="users/:id"
          element={
            <PermissionGuard required="users.view">
              <UserDetailPage />
            </PermissionGuard>
          }
        />

        {/* Executive Dashboards & Reports */}
        <Route path="admin" element={<Navigate to="/admin/activity" replace />} />
        <Route
          path="admin/activity"
          element={
            <PermissionGuard role="SUPER_ADMIN">
              <AdminActivityPage />
            </PermissionGuard>
          }
        />
        <Route
          path="admin/tasks"
          element={
            <PermissionGuard role="SUPER_ADMIN">
              <AdminTasksSummaryPage />
            </PermissionGuard>
          }
        />
        <Route
          path="admin/leads"
          element={
            <PermissionGuard role="SUPER_ADMIN">
              <AdminLeadsExecutivePage />
            </PermissionGuard>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
