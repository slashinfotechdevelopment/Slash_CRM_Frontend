import React, { useState } from 'react';
import { TableSkeleton, CardSkeleton, DetailSkeleton } from '@/components/feedback/Skeleton';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { Button } from '@/components/ui/Button';
import { useConfirm } from '@/hooks/useConfirm';
import { useToast } from '@/hooks/useToast';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, Layers } from 'lucide-react';

export const TemplateShowcasePage: React.FC = () => {
  const confirm = useConfirm();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'skeletons' | 'empty' | 'error' | 'dialogs'>('dialogs');

  const showDangerDialog = async () => {
    const res = await confirm({
      tone: 'danger',
      title: 'Permanent Deletion Notice',
      message: 'Are you sure you want to delete this custom role? This will revoke all authorizations.',
      confirmLabel: 'Delete Permanently',
      consequence: 'This action is irreversible and recorded in the audit trail.',
      withReason: true,
      reasonPlaceholder: 'Enter deletion reason for compliance auditing...',
    });
    if (res.confirmed) toast.danger('Action confirmed with reason: ' + (res.reason || 'None'));
  };

  const showWarningDialog = async () => {
    const res = await confirm({
      tone: 'warning',
      title: 'Overtime Shift Threshold Warning',
      message: 'The submitted work hours exceed standard daily thresholds. Do you want to proceed with administrative override?',
      confirmLabel: 'Apply Override',
      cancelLabel: 'Review Shifts',
    });
    if (res.confirmed) toast.warning('Override applied successfully.');
  };

  const showSuccessDialog = async () => {
    const res = await confirm({
      tone: 'success',
      title: 'Permissions Synchronized',
      message: 'All 120 fine-grained capabilities have been successfully mapped to active role profiles.',
      confirmLabel: 'View Mappings',
      cancelLabel: 'Dismiss',
    });
    if (res.confirmed) toast.success('Synchronized view acknowledged.');
  };

  const showInfoDialog = async () => {
    const res = await confirm({
      tone: 'info',
      title: 'Google Calendar Sync Notice',
      message: 'Government holiday calendar synchronization occurs automatically every midnight UTC.',
      confirmLabel: 'Understood',
      cancelLabel: 'Close',
    });
    if (res.confirmed) toast.info('Notice acknowledged.');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Layers className="w-6 h-6 text-brand-primary" />
            <span>Shared UI Template & State Showcase</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Verification proof for Skeleton, EmptyState, ErrorState, and Color-Coded ConfirmDialogs.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          {(['dialogs', 'skeletons', 'empty', 'error'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all ${
                activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* DIALOGS SHOWCASE */}
      {activeTab === 'dialogs' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
              Interactive Trigger Controls
            </h2>
            <p className="text-xs text-slate-500 mb-4">
              Click any button to open the accessible modal dialog with focus trapping and mobile bottom-sheet behavior.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="danger" size="md" onClick={showDangerDialog}>
                Open Danger Dialog (Red)
              </Button>
              <Button
                variant="primary"
                size="md"
                className="bg-amber-600 hover:bg-amber-700"
                onClick={showWarningDialog}
              >
                Open Warning Dialog (Amber)
              </Button>
              <Button variant="accent" size="md" onClick={showSuccessDialog}>
                Open Success Dialog (Green)
              </Button>
              <Button variant="primary" size="md" onClick={showInfoDialog}>
                Open Info Dialog (Blue)
              </Button>
            </div>
          </div>

          {/* Visual Side-by-Side Comparison of all 4 Tones */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. DANGER */}
            <div className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-red-50 border border-red-100 flex-shrink-0">
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                      Tone: Danger (Red)
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Delete Role Permanently</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Are you sure you want to deactivate and remove this custom role? This will revoke active authorizations.
                    </p>
                    <div className="mt-2.5 p-2 bg-red-50 border border-red-100 rounded-lg text-xs font-medium text-red-700">
                      Consequence: Reassignment of assigned personnel is required before deletion.
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2.5">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button variant="danger" size="sm">Delete Role</Button>
              </div>
            </div>

            {/* 2. WARNING */}
            <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-amber-50 border border-amber-100 flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                      Tone: Warning (Amber)
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Threshold Policy Warning</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      The requested biometric time correction exceeds maximum daily variance rules. Apply administrative override?
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2.5">
                <Button variant="outline" size="sm">Cancel</Button>
                <Button variant="primary" size="sm" className="bg-amber-600 hover:bg-amber-700">Proceed</Button>
              </div>
            </div>

            {/* 3. SUCCESS */}
            <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-emerald-50 border border-emerald-100 flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      Tone: Success (Green)
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Action Complete</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Department hierarchy and assigned permissions updated successfully across all operational clusters.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2.5">
                <Button variant="accent" size="sm">Got it</Button>
              </div>
            </div>

            {/* 4. INFO */}
            <div className="bg-white rounded-2xl border border-indigo-200 shadow-sm overflow-hidden flex flex-col justify-between">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-full bg-indigo-50 border border-indigo-100 flex-shrink-0">
                    <Info className="w-6 h-6 text-brand-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-primary uppercase tracking-wider">
                      Tone: Info (Brand Navy/Blue)
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-1">Google Calendar Sync Notice</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Upcoming government holiday updates will synchronize with all active team schedules automatically.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-100 flex justify-end gap-2.5">
                <Button variant="outline" size="sm">Dismiss</Button>
                <Button variant="primary" size="sm">Acknowledge</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SKELETONS SHOWCASE */}
      {activeTab === 'skeletons' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Table Layout Skeleton (List View)
            </h2>
            <TableSkeleton rows={4} columns={5} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Card Metric Skeleton (Dashboard View)
            </h2>
            <CardSkeleton count={4} />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-800">
              Detail Overview Skeleton
            </h2>
            <DetailSkeleton />
          </div>
        </div>
      )}

      {/* EMPTY STATE SHOWCASE */}
      {activeTab === 'empty' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <EmptyState
            title="No CRM Leads Found"
            description="There are currently no prospect inquiries or active opportunities in this pipeline stage. Start by capturing a new lead."
            actionLabel="Create First Lead"
            onAction={() => toast.info('Create lead action clicked')}
          />
        </div>
      )}

      {/* ERROR STATE SHOWCASE */}
      {activeTab === 'error' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <ErrorState
            title="Unable to Retrieve Department Records"
            message="The network connection timed out while querying the department hierarchy database. Please verify your connection and try again."
            onRetry={() => toast.info('Retry trigger invoked')}
          />
        </div>
      )}
    </div>
  );
};
