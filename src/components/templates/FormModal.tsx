import React, { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, AlertCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

export interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string | null;
  showCancel?: boolean;
  submitVariant?: 'primary' | 'accent' | 'danger';
  errorMessage?: string | null;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const FormModal: React.FC<FormModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save Changes',
  cancelLabel = 'Cancel',
  showCancel = true,
  submitVariant = 'primary',
  errorMessage,
  children,
  maxWidth = 'lg',
}) => {
  useEffect(() => {
    if (isOpen) {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && !isSubmitting) {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, isSubmitting, onClose]);

  if (!isOpen) return null;

  const maxWidths = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl',
    '2xl': 'sm:max-w-2xl',
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          'w-full bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all',
          'max-h-[96vh] min-h-[420px] flex flex-col',
          maxWidths[maxWidth]
        )}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 id="modal-title" className="text-base sm:text-lg font-bold text-slate-900">
              {title}
            </h3>
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-6 space-y-4 flex-1">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}
            {children}
          </div>

          {/* Footer Actions */}
          <div className="bg-slate-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2.5 sm:gap-3 border-t border-slate-100 flex-shrink-0">
            {showCancel && Boolean(cancelLabel) && (
              <Button
                variant="outline"
                size="md"
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
              >
                {cancelLabel}
              </Button>
            )}
            <Button
              variant={submitVariant}
              size="md"
              type="submit"
              isLoading={isSubmitting}
            >
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
