import React, { useState, useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useConfirm } from '@/hooks/useConfirm';
import {
  LayoutDashboard,
  Clock,
  CheckSquare,
  Users,
  ShieldCheck,
  Palmtree,
  Target,
  BarChart3,
  LogOut,
  Building2,
  X,
  KeyRound,
  Layers,
  ChevronDown,
  LucideIcon,
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface NavChild {
  label: string;
  path: string;
  permission?: string | string[];
  role?: string | string[];
}

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  permission?: string | string[];
  role?: string | string[];
  children?: NavChild[];
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout, hasPermission, hasRole } = useAuth();
  const confirm = useConfirm();
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedSections((prev) => {
      const currentVal = prev[path] ?? location.pathname.startsWith(path);
      return { ...prev, [path]: !currentVal };
    });
  };

  const handleLogout = async () => {
    const res = await confirm({
      tone: 'danger',
      title: 'Sign Out of Slash CRM?',
      message: 'Are you sure you want to end your session on this device?',
      confirmLabel: 'Sign Out',
      cancelLabel: 'Stay Signed In',
    });
    if (res.confirmed) {
      await logout();
    }
  };

  const rawNavItems: NavItem[] = useMemo(
    () => [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Roles & Security', path: '/roles', icon: ShieldCheck, role: ['SUPER_ADMIN', 'ADMIN'], permission: 'roles.view' },
      { label: 'Permissions', path: '/permissions', icon: KeyRound, role: ['SUPER_ADMIN', 'ADMIN'], permission: 'permissions.view' },
      { label: 'Departments', path: '/departments', icon: Building2, role: ['SUPER_ADMIN', 'ADMIN', 'HR'], permission: ['departments.view', 'roles.view'] },
      { label: 'Users & Teams', path: '/users', icon: Users, role: ['SUPER_ADMIN', 'ADMIN', 'HR'], permission: 'users.view' },
      {
        label: 'Attendance & Shifts',
        path: '/attendance',
        icon: Clock,
        children: [
          { label: 'My Attendance', path: '/attendance/my' },
          { label: 'Team Attendance', path: '/attendance/team', role: ['ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'], permission: 'attendance.view' },
          { label: 'Shifts Management', path: '/attendance/shifts', role: ['ADMIN', 'SUPER_ADMIN', 'HR'], permission: 'attendance.manage_shifts' },
          {
            label: 'WFH Requests',
            path: '/attendance/wfh',
            permission: ['attendance.view_wfh', 'attendance.request_wfh', 'attendance.approve_wfh'],
          },
          {
            label: 'Overtime Requests',
            path: '/attendance/overtime',
            permission: ['attendance.view_overtime', 'attendance.request_overtime', 'attendance.approve_overtime'],
          },
          {
            label: 'Corrections',
            path: '/attendance/corrections',
            permission: ['attendance.correct_own', 'attendance.review_correction'],
          },
          {
            label: 'Quarantined Anomalies',
            path: '/attendance/anomalies',
            role: ['ADMIN', 'SUPER_ADMIN', 'HR'],
            permission: 'attendance.view_anomalies',
          },
          {
            label: 'EOD Reconciliation',
            path: '/attendance/reconciliation',
            role: ['ADMIN', 'SUPER_ADMIN', 'HR'],
            permission: 'attendance.reconcile',
          },
        ],
      },
      {
        label: 'Tasks & Deliverables',
        path: '/tasks',
        icon: CheckSquare,
        children: [
          { label: 'All Tasks & Kanban', path: '/tasks', role: ['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'], permission: ['tasks.assign', 'tasks.create'] },
          { label: 'My Tasks & Timer', path: '/tasks/my', permission: ['tasks.view_own', 'tasks.view'] },
          { label: 'Task Dashboards', path: '/tasks/dashboards', role: ['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'], permission: ['reports.view', 'tasks.view'] },
          { label: 'Task Reports', path: '/tasks/reports', role: ['ADMIN', 'SUPER_ADMIN', 'PROJECT_MANAGER'], permission: 'reports.view' },
        ],
      },
      {
        label: 'Leads & Pipeline',
        path: '/leads',
        icon: Target,
        role: ['ADMIN', 'SUPER_ADMIN', 'SALES'],
        permission: 'leads.view',
        children: [
          { label: 'All Leads & Pipeline', path: '/leads', permission: 'leads.view' },
          { label: 'Pipeline Intelligence', path: '/leads/pipeline', permission: 'leads.view' },
          { label: 'My Follow-Ups', path: '/leads/follow-ups', permission: 'leads.view' },
        ],
      },
      {
        label: 'Leave & Absence',
        path: '/leave',
        icon: Palmtree,
        children: [
          { label: 'My Leave & Balance', path: '/leave/my' },
          {
            label: 'Approvals & Review',
            path: '/leave/approvals',
            role: ['ADMIN', 'SUPER_ADMIN', 'HR', 'PROJECT_MANAGER'],
            permission: ['leave.view_requests', 'leave.approve'],
          },
          { label: 'Employee Balances', path: '/leave/balances', role: ['ADMIN', 'SUPER_ADMIN', 'HR'], permission: 'leave.view_balances' },
          { label: 'Leave Calendar', path: '/leave/calendar', permission: ['leave.view_requests', 'leave.view'] },
          {
            label: 'Holidays & Workweeks',
            path: '/leave/holidays',
            role: ['ADMIN', 'SUPER_ADMIN', 'HR'],
            permission: ['leave.manage_holidays', 'leave.manage_weekly_offs'],
          },
          { label: 'Policy Setup', path: '/leave/setup', role: ['ADMIN', 'SUPER_ADMIN', 'HR'], permission: ['leave.manage_types', 'leave.manage_policies'] },
          { label: 'Leave Reports', path: '/leave/reports', role: ['ADMIN', 'SUPER_ADMIN', 'HR'], permission: 'leave.view_reports' },
        ],
      },
      {
        label: 'Admin Intelligence',
        path: '/admin',
        icon: BarChart3,
        role: 'SUPER_ADMIN',
        children: [
          { label: 'Personnel Activity', path: '/admin/activity', role: 'SUPER_ADMIN' },
          { label: 'Deliverable Velocity', path: '/admin/tasks', role: 'SUPER_ADMIN' },
          { label: 'Executive CRM', path: '/admin/leads', role: 'SUPER_ADMIN' },
        ],
      },
      ...(import.meta.env.DEV ? [{ label: 'UI Template Showcase', path: '/dev/showcase', icon: Layers, role: 'SUPER_ADMIN' }] : []),
    ],
    []
  );

  // Filter navigation items by active user capabilities
  const filteredNavItems = useMemo(() => {
    return rawNavItems
      .map((item) => {
        // If parent item specifies role check
        if (item.role && !hasRole(item.role)) {
          return null;
        }
        // If parent item specifies permission check
        if (item.permission && !hasPermission(item.permission)) {
          return null;
        }

        // Filter children if present
        if (item.children && item.children.length > 0) {
          const visibleChildren = item.children.filter((child) => {
            if (child.role && !hasRole(child.role)) return false;
            if (child.permission && !hasPermission(child.permission)) return false;
            return true;
          });

          // If no children remain visible, do not show parent
          if (visibleChildren.length === 0) {
            return null;
          }

          return { ...item, children: visibleChildren };
        }

        return item;
      })
      .filter((item): item is NavItem => item !== null);
  }, [rawNavItems, hasPermission, hasRole]);

  return (
    <>
      {/* Drawer Backdrop (< 1024px) */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-900/50 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          'fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between transition-transform duration-200 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-auto lg:w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Top: Logo & Navigation */}
        <div className="flex flex-col flex-1 min-h-0">
          <div className="h-16 px-5 border-b border-neutral-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="Slash Logo" className="w-8 h-8 object-contain" />
              <div className="flex flex-col">
                <span className="font-bold text-brand-primary text-sm leading-tight tracking-tight">
                  SLASH INFOTECH
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold uppercase tracking-wider">
                  Enterprise CRM
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden text-neutral-400 hover:text-neutral-600 p-1.5 rounded-lg"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-2.5 space-y-1 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const hasChildren = Boolean(item.children && item.children.length > 0);
              const isSectionActive = location.pathname.startsWith(item.path);
              const isExpanded = expandedSections[item.path] ?? isSectionActive;

              if (hasChildren) {
                return (
                  <div key={item.path} className="space-y-0.5">
                    <div
                      className={cn(
                        'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer',
                        isSectionActive
                          ? 'bg-brand-primary/10 text-brand-primary font-semibold'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      )}
                      onClick={(e) => toggleSection(item.path, e)}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200 text-neutral-400',
                          isExpanded && 'rotate-180 text-neutral-600'
                        )}
                      />
                    </div>

                    {isExpanded && (
                      <div className="pl-7 space-y-0.5 border-l-2 border-neutral-100 ml-4 py-1">
                        {item.children!.map((child) => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            end={true}
                            onClick={() => {
                              if (window.innerWidth < 1024) onClose();
                            }}
                            className={({ isActive }) =>
                              cn(
                                'block px-2.5 py-1.5 rounded-md text-xs font-medium transition-all duration-150',
                                isActive
                                  ? 'bg-brand-primary text-white shadow-xs'
                                  : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
                              )
                            }
                          >
                            {child.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/' || item.path === '/dashboard'}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-brand-primary text-white shadow-sm'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    )
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom: User Profile & Sign Out (Clean, flush layout with no redundant margins) */}
        <div className="p-3 border-t border-neutral-200 bg-white flex-shrink-0">
          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-full bg-brand-primary text-white font-semibold text-xs flex items-center justify-center flex-shrink-0">
                {user?.name ? user.name.slice(0, 2).toUpperCase() : 'US'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {user?.name || 'CRM User'}
                </p>
                <p className="text-[11px] text-neutral-500 truncate">
                  {user?.email || 'user@slash.internal'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex-shrink-0"
              title="Sign Out"
              aria-label="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
