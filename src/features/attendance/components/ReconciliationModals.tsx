import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import {
  ReconciliationRun,
  ReconciliationRunStatus,
  ReconciliationStatusResponse,
} from '@/api/types/attendance.types';
import { UserItem } from '@/api/types/users.types';
import { formatDate } from '@/utils/formatters';

interface ReconciliationModalsProps {
  isTriggerOpen: boolean;
  onCloseTrigger: () => void;
  targetDate: string;
  onTargetDateChange: (val: string) => void;
  forceReconcile: boolean;
  onForceReconcileChange: (val: boolean) => void;
  forceReason: string;
  onForceReasonChange: (val: string) => void;
  triggerNotes: string;
  onTriggerNotesChange: (val: string) => void;
  isTriggering: boolean;
  onTriggerSubmit: (e: React.FormEvent) => Promise<void>;

  isDetailOpen: boolean;
  onCloseDetail: () => void;
  selectedRun: ReconciliationRun | null;
  loadingDetail: boolean;

  isStatusInspectorOpen: boolean;
  onCloseStatusInspector: () => void;
  usersList: UserItem[];
  inspectorUserId: string;
  onInspectorUserIdChange: (val: string) => void;
  inspectorDate: string;
  onInspectorDateChange: (val: string) => void;
  inspectionResult: ReconciliationStatusResponse | null;
  loadingInspection: boolean;
  onInspectStatus: (e: React.FormEvent) => Promise<void>;
}

export const ReconciliationModals: React.FC<ReconciliationModalsProps> = ({
  isTriggerOpen,
  onCloseTrigger,
  targetDate,
  onTargetDateChange,
  forceReconcile,
  onForceReconcileChange,
  forceReason,
  onForceReasonChange,
  triggerNotes,
  onTriggerNotesChange,
  isTriggering,
  onTriggerSubmit,
  isDetailOpen,
  onCloseDetail,
  selectedRun,
  loadingDetail,
  isStatusInspectorOpen,
  onCloseStatusInspector,
  usersList,
  inspectorUserId,
  onInspectorUserIdChange,
  inspectorDate,
  onInspectorDateChange,
  inspectionResult,
  loadingInspection,
  onInspectStatus,
}) => {
  const getStatusBadge = (status: ReconciliationRunStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Completed</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="warning">In Progress</Badge>;
      case 'PARTIAL':
        return <Badge variant="warning">Partial</Badge>;
      case 'FAILED':
        return <Badge variant="danger">Failed</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <>
      {/* Trigger Reconciliation Modal */}
      <FormModal
        isOpen={isTriggerOpen}
        onClose={onCloseTrigger}
        title="Trigger EOD Reconciliation"
        subtitle="Execute daily closure, apply shift grace cutoffs, and quarantine anomalies"
        onSubmit={onTriggerSubmit}
        isSubmitting={isTriggering}
        submitLabel="Execute Run"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Input
            label="Target Attendance Date"
            type="date"
            value={targetDate}
            onChange={(e) => onTargetDateChange(e.target.value)}
            required
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="forceRec"
              checked={forceReconcile}
              onChange={(e) => onForceReconcileChange(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="forceRec" className="text-xs font-medium text-neutral-800">
              Force Reconciliation (Bypass shift end grace period cutoff)
            </label>
          </div>

          {forceReconcile && (
            <Input
              label="Mandatory Override Justification"
              placeholder="e.g. Early payroll cutoff authorized by HR director"
              value={forceReason}
              onChange={(e) => onForceReasonChange(e.target.value)}
              required
            />
          )}

          <Input
            label="Operational Notes (Optional)"
            placeholder="Optional trigger remarks..."
            value={triggerNotes}
            onChange={(e) => onTriggerNotesChange(e.target.value)}
          />
        </div>
      </FormModal>

      {/* Run Details Modal */}
      <FormModal
        isOpen={isDetailOpen}
        onClose={onCloseDetail}
        title="Reconciliation Run Summary"
        subtitle={selectedRun ? `Target Date: ${formatDate(selectedRun.targetDate)}` : undefined}
        onSubmit={(e) => {
          e.preventDefault();
          onCloseDetail();
        }}
        submitLabel="Close"
        submitVariant="primary"
      >
        {loadingDetail ? (
          <div className="py-8 text-center text-xs text-neutral-500">Loading run details...</div>
        ) : selectedRun ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3 bg-neutral-50 p-3 rounded-lg border border-neutral-200/60">
              <div>
                <span className="text-neutral-500 block">Status</span>
                <span className="mt-0.5 inline-block">{getStatusBadge(selectedRun.status)}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Trigger Source</span>
                <span className="font-semibold text-neutral-800">{selectedRun.triggerSource || 'SYSTEM_CRON'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Processed Records</span>
                <span className="font-semibold text-neutral-900">{selectedRun.totalRecordsProcessed ?? '—'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Successfully Reconciled</span>
                <span className="font-semibold text-emerald-700">{selectedRun.reconciledRecordsCount ?? '—'}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Quarantined Anomalies</span>
                <span className="font-semibold text-rose-600">{selectedRun.anomaliesCount ?? 0}</span>
              </div>
              <div>
                <span className="text-neutral-500 block">Execution Duration</span>
                <span className="font-mono text-neutral-800">{selectedRun.executionDurationMs} ms</span>
              </div>
            </div>

            {Boolean(selectedRun.logs) && (
              <div>
                <span className="font-semibold text-neutral-800 block mb-1">Execution Logs:</span>
                <pre className="bg-neutral-900 text-neutral-100 p-3 rounded text-[11px] overflow-x-auto max-h-48">
                  {String(typeof selectedRun.logs === 'string' ? selectedRun.logs : JSON.stringify(selectedRun.logs, null, 2))}
                </pre>
              </div>
            )}
          </div>
        ) : null}
      </FormModal>

      {/* Status Inspector Modal */}
      <FormModal
        isOpen={isStatusInspectorOpen}
        onClose={onCloseStatusInspector}
        title="Employee Reconciliation Health Inspector"
        subtitle="Lookup live reconciliation and anomaly status for an employee on a specific calendar date"
        onSubmit={onInspectStatus}
        isSubmitting={loadingInspection}
        submitLabel="Inspect Status"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Select
            label="Employee"
            value={inspectorUserId}
            onChange={(e) => onInspectorUserIdChange(e.target.value)}
            options={usersList.map((u) => ({
              value: u.id,
              label: `${u.name} (${u.email})`,
            }))}
            required
          />

          <Input
            label="Attendance Date"
            type="date"
            value={inspectorDate}
            onChange={(e) => onInspectorDateChange(e.target.value)}
            required
          />

          {inspectionResult && (
            <div className="border-t border-neutral-200/80 pt-3 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded bg-neutral-50 border border-neutral-200">
                <span className="font-medium text-neutral-700">Reconciliation State:</span>
                {inspectionResult.isReconciled ? (
                  <Badge variant="success">Reconciled</Badge>
                ) : (
                  <Badge variant="warning">Pending / Unreconciled</Badge>
                )}
              </div>

              {inspectionResult.record && (
                <div className="p-2.5 rounded bg-neutral-50 border border-neutral-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Final Attendance Status:</span>
                    <span className="font-semibold text-neutral-800">{inspectionResult.record.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Net Working Minutes:</span>
                    <span className="font-semibold text-neutral-800">{inspectionResult.record.netMinutes}m</span>
                  </div>
                </div>
              )}

              {inspectionResult.anomalies && inspectionResult.anomalies.length > 0 && (
                <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-800">
                  <span className="font-semibold block mb-1">Active Anomalies Detected:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {inspectionResult.anomalies.map((a: unknown, i: number) => {
                      const anom = a as { anomalyType?: string; description?: string };
                      return <li key={i}>{anom.anomalyType || anom.description}</li>;
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </FormModal>
    </>
  );
};
