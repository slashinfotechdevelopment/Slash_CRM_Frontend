import React, { useState, useEffect, useRef } from 'react';
import { useConfirmState, ConfirmTone } from '@/hooks/useConfirm';
import { Button } from '@/components/ui/Button';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ConfirmDialog: React.FC = () => {
  const { confirmState, closeConfirm } = useConfirmState();
  const [reason, setReason] = useState<string>('');
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (confirmState?.isOpen) {
      setReason('');
      // Handle Escape key
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          closeConfirm({ confirmed: false });
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [confirmState?.isOpen, closeConfirm]);

  if (!confirmState || !confirmState.isOpen) return null;

  const { options } = confirmState;
  const tone: ConfirmTone = options.tone || 'info';

  const toneConfig = {
    danger: {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      iconBg: 'bg-red-50 border border-red-100',
      btnVariant: 'danger' as const,
      defaultConfirm: 'Confirm Action',
    },
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-50 border border-amber-100',
      btnVariant: 'primary' as const,
      defaultConfirm: 'Proceed',
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border border-emerald-100',
      btnVariant: 'accent' as const,
      defaultConfirm: 'Got it',
    },
    info: {
      icon: <Info className="w-6 h-6 text-brand-primary" />,
      iconBg: 'bg-indigo-50 border border-indigo-100',
      btnVariant: 'primary' as const,
      defaultConfirm: 'Acknowledge',
    },
  };

  const currentTone = toneConfig[tone];

  const handleConfirm = () => {
    closeConfirm({
      confirmed: true,
      reason: options.withReason ? reason : undefined,
    });
  };

  const handleCancel = () => {
    closeConfirm({ confirmed: false });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div
        ref={dialogRef}
        className={cn(
          'w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all',
          'max-h-[90vh] flex flex-col',
          'sm:max-w-lg'
        )}
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-start gap-4">
          <div className={cn('p-3 rounded-full flex-shrink-0', currentTone.iconBg)}>
            {currentTone.icon}
          </div>
          <div className="flex-1 min-w-0 pr-6">
            <h3 id="confirm-dialog-title" className="text-base sm:text-lg font-bold text-slate-900 leading-6">
              {options.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
              {options.message}
            </p>
            {options.consequence && (
              <div
                className={cn(
                  'mt-2.5 p-2.5 rounded-lg text-xs font-medium flex items-start gap-2',
                  (options.consequenceTone || 'warning') === 'danger'
                    ? 'bg-red-50 border border-red-200 text-red-700'
                    : (options.consequenceTone || 'warning') === 'warning'
                    ? 'bg-amber-50 border border-amber-200 text-amber-800'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                )}
              >
                <span className="flex-1">{options.consequence}</span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg -mt-1 -mr-2"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Optional Reason field */}
        {options.withReason && (
          <div className="px-6 py-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Reason / Remarks (Optional)
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={options.reasonPlaceholder || 'Provide details for this action...'}
              className="w-full text-sm p-3 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 border-t border-slate-100">
          {options.singleButton ? (
            <Button variant="outline" size="md" onClick={handleCancel}>
              {options.confirmLabel || 'Close'}
            </Button>
          ) : (
            <>
              <Button variant="outline" size="md" onClick={handleCancel}>
                {options.cancelLabel || 'Cancel'}
              </Button>
              <Button variant={currentTone.btnVariant} size="md" onClick={handleConfirm}>
                {options.confirmLabel || currentTone.defaultConfirm}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
