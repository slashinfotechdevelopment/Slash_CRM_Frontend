import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Clock,
  Target,
  CheckSquare,
  Building2,
  ShieldCheck,
  Calendar,
  Sparkles,
  ArrowUpRight,
  LogOut,
} from 'lucide-react';
import { useConfirm } from '@/hooks/useConfirm';

export const DashboardPage: React.FC = () => {
  const { user, logoutAll, hasPermission, isSuperAdmin, hasRole } = useAuth();
  const navigate = useNavigate();
  const confirm = useConfirm();

  const handleTerminateAllSessions = async () => {
    const res = await confirm({
      tone: 'danger',
      title: 'Terminate All Active Sessions?',
      message:
        'This will invalidate all active refresh tokens and sign you out across all devices and browsers.',
      confirmLabel: 'Terminate All Sessions',
      consequence: 'You will need to sign in again with a new OTP.',
    });
    if (res.confirmed) {
      await logoutAll();
    }
  };

  const statCards = [
    {
      label: 'Organization',
      value: user?.organizationName || 'Slash Infotech',
      helper: 'Multi-tenant root domain',
      icon: Building2,
      variant: 'primary' as const,
      route: hasPermission('users.view') ? '/users' : '/dashboard',
    },
    {
      label: 'Security Role',
      value: user?.roles?.[0]?.name || user?.role || (user as unknown as { userType?: { name?: string; code?: string } })?.userType?.name || 'Employee',
      helper: 'Active authorization role',
      icon: ShieldCheck,
      variant: 'accent' as const,
      route: hasPermission('roles.view') ? '/roles' : '/dashboard',
    },
    {
      label: 'CRM Module Status',
      value: 'All Systems Active',
      helper: 'All services synchronized',
      icon: Sparkles,
      variant: 'success' as const,
      route: isSuperAdmin ? '/admin' : '/dashboard',
    },
    {
      label: 'Attendance & Shifts',
      value: 'Active Shift',
      helper: 'Ready for check-in / out',
      icon: Clock,
      variant: 'info' as const,
      route: '/attendance/my',
    },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Welcome Card */}
      <div className="bg-gradient-to-r from-brand-primary to-brand-primary-hover rounded-2xl p-6 sm:p-8 text-white shadow-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold backdrop-blur-sm border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Slash CRM 2.0 Live Platform
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome, {user?.name || 'Administrator'}
          </h1>
          <p className="text-sm text-indigo-100 max-w-xl leading-relaxed">
            Manage your workforce attendance, automated shifts, CRM pipeline leads, team task
            schedules, and organizational policies in one unified dashboard.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {hasPermission('leads.view') && (
            <Button
              variant="accent"
              size="md"
              onClick={() => navigate('/leads')}
              rightIcon={<ArrowUpRight className="w-4 h-4" />}
            >
              Manage Leads
            </Button>
          )}
          {hasPermission(['tasks.view_own', 'tasks.view']) && (
            <Button
              variant="outline"
              size="md"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white"
              onClick={() => navigate(isSuperAdmin || hasRole('ADMIN') ? '/tasks' : '/tasks/my')}
            >
              {isSuperAdmin || hasRole('ADMIN') ? 'Team Tasks' : 'My Tasks'}
            </Button>
          )}
        </div>
      </div>

      {/* Metric Cards (Beehiiv Template style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => navigate(card.route)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-brand-primary/30 hover:shadow-card transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {card.label}
                </span>
                <div className="p-2 rounded-lg bg-slate-50 text-brand-primary border border-slate-100">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {card.value}
                </p>
                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                  <span>{card.helper}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Navigation Hub & Security Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Operational Workspaces */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
            <span>Operational Hubs</span>
            <Badge variant="primary">Active</Badge>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => navigate('/attendance/my')}
              className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-lg bg-indigo-50 text-brand-primary">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Attendance & Shifts</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Clock in/out, active shift status, overtime claims & dispute corrections.
                </p>
              </div>
            </div>

            <div
              onClick={() => navigate(isSuperAdmin || hasRole(['ADMIN', 'PROJECT_MANAGER']) ? '/tasks' : '/tasks/my')}
              className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {isSuperAdmin || hasRole(['ADMIN', 'PROJECT_MANAGER']) ? 'Team Tasks & Kanban' : 'My Tasks & Timer'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {isSuperAdmin || hasRole(['ADMIN', 'PROJECT_MANAGER'])
                    ? 'Team tasks, partial-day timings, kanban board, reviews & time logs.'
                    : 'Personal assigned tasks, timer tracker, submit for review & comments.'}
                </p>
              </div>
            </div>

            {hasPermission('leads.view') && (
              <div
                onClick={() => navigate('/leads')}
                className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-start gap-3.5"
              >
                <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Leads & Sales CRM</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Pipeline stages, follow-ups, timeline logs, import & conversion.
                  </p>
                </div>
              </div>
            )}

            <div
              onClick={() => navigate('/leave/my')}
              className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 transition-all cursor-pointer flex items-start gap-3.5"
            >
              <div className="p-2.5 rounded-lg bg-amber-50 text-amber-600">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Leave & Absence</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Leave balance, time-off requests, approval status & holiday calendar.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: User Active Session Profile */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Session Profile
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400">User ID</span>
                <span className="text-xs font-mono text-slate-700 truncate max-w-[150px]">
                  {user?.id || '-'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400">Email</span>
                <span className="text-xs font-medium text-slate-800">{user?.email}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400">Department</span>
                <span className="text-xs font-medium text-slate-800">
                  {user?.departmentName || 'General Management'}
                </span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-xs text-slate-400">Auth Method</span>
                <Badge variant="accent" size="sm">
                  OTP Passwordless
                </Badge>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-100">
            <Button
              variant="outline"
              size="md"
              className="w-full text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 hover:border-red-200"
              onClick={handleTerminateAllSessions}
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Terminate All Active Sessions
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
