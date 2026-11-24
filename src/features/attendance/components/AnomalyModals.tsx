import React from 'react';
import { FormModal } from '@/components/templates/FormModal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { AnomalyRecord, AnomalyStatus, AnomalyResolutionAction } from '@/api/types/attendance.types';
import { formatDate } from '@/utils/formatters';

interface AnomalyModalsProps {
  isDetailOpen: boolean;
  onCloseDetail: () => void;
  selectedAnomaly: AnomalyRecord | null;
  loadingDetail: boolean;

  isResolveOpen: boolean;
  onCloseResolve: () => void;
  action: AnomalyResolutionAction;
  onActionChange: (action: AnomalyResolutionAction) => void;
  resolutionNotes: string;
  onResolutionNotesChange: (notes: string) => void;
  recalculate: boolean;
  onRecalculateChange: (recalc: boolean) => void;
  isResolving: boolean;
  onResolveSubmit: (e: React.FormEvent) => Promise<void>;
}

export const AnomalyModals: React.FC<AnomalyModalsProps> = ({
  isDetailOpen,
  onCloseDetail,
  selectedAnomaly,
  loadingDetail,
  isResolveOpen,
  onCloseResolve,
  action,
  onActionChange,
  resolutionNotes,
  onResolutionNotesChange,
  recalculate,
  onRecalculateChange,
  isResolving,
  onResolveSubmit,
}) => {
  const getStatusBadge = (status: AnomalyStatus, isResolved?: boolean) => {
    if (isResolved || status === 'RESOLVED') {
      return <Badge variant="success">Resolved</Badge>;
    }
    if (status === 'DISMISSED') {
      return <Badge variant="neutral">Dismissed</Badge>;
    }
    return <Badge variant="danger">Quarantined</Badge>;
  };

  return (
    <>
      {/* Anomaly Details Modal */}
      <FormModal
        isOpen={isDetailOpen}
        onClose={onCloseDetail}
        title="Anomaly Breakdown & Record Context"
        subtitle={selectedAnomaly ? `Type: ${selectedAnomaly.anomalyType}` : undefined}
        onSubmit={(e) => {
          e.preventDefault();
          onCloseDetail();
        }}
        submitLabel="Close"
        submitVariant="primary"
      >
        {loadingDetail ? (
          <div className="py-8 text-center text-xs text-neutral-500">Loading anomaly details...</div>
        ) : selectedAnomaly ? (
          <div className="space-y-4 text-xs">
            <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200/60 space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Status</span>
                {getStatusBadge(selectedAnomaly.status, selectedAnomaly.isResolved)}
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Anomaly Type</span>
                <span className="font-semibold text-neutral-900">{selectedAnomaly.anomalyType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Recorded Date</span>
                <span className="font-medium text-neutral-800">
                  {formatDate(selectedAnomaly.attendanceRecord?.attendanceDate || selectedAnomaly.createdAt)}
                </span>
              </div>
            </div>

            <div>
              <span className="font-semibold text-neutral-800 block mb-1">Description:</span>
              <p className="bg-neutral-50 p-2.5 rounded border border-neutral-200 text-neutral-700">
                {selectedAnomaly.description || 'System quarantined irregularity.'}
              </p>
            </div>

            {selectedAnomaly.resolutionNotes && (
              <div>
                <span className="font-semibold text-neutral-800 block mb-1">Resolution Audit Notes:</span>
                <p className="bg-neutral-50 p-2.5 rounded border border-neutral-200 text-neutral-700">
                  {selectedAnomaly.resolutionNotes}
                </p>
              </div>
            )}
          </div>
        ) : null}
      </FormModal>

      {/* Resolve / Dismiss Anomaly Modal */}
      <FormModal
        isOpen={isResolveOpen}
        onClose={onCloseResolve}
        title="Resolve Quarantined Anomaly"
        subtitle="Record mandatory auditor justification and trigger deterministic recalculation"
        onSubmit={onResolveSubmit}
        isSubmitting={isResolving}
        submitLabel="Submit Resolution"
        submitVariant="primary"
      >
        <div className="space-y-4">
          <Select
            label="Resolution Action"
            value={action}
            onChange={(e) => onActionChange(e.target.value as AnomalyResolutionAction)}
            options={[
              { value: 'RESOLVE', label: 'Resolve (Apply corrections and clear anomaly)' },
              { value: 'DISMISS', label: 'Dismiss (Acknowledge and archive without corrections)' },
            ]}
          />

          <Input
            label="Audit Notes / Justification (Mandatory)"
            placeholder="e.g. Verified employee presence via access control logs; adjusted session"
            value={resolutionNotes}
            onChange={(e) => onResolutionNotesChange(e.target.value)}
            required
          />

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="recalc"
              checked={recalculate}
              onChange={(e) => onRecalculateChange(e.target.checked)}
              className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="recalc" className="text-xs font-medium text-neutral-800">
              Trigger automatic attendance recalculation after resolution
            </label>
          </div>
        </div>
      </FormModal>
    </>
  );
};
