import React from 'react';
import { useToast, ToastItem } from '@/hooks/useToast';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import { cn } from '@/utils/cn';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
    >
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

const ToastMessage: React.FC<{ toast: ToastItem; onClose: () => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    danger: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white shadow-card',
    danger: 'border-red-200 bg-white shadow-card',
    warning: 'border-amber-200 bg-white shadow-card',
    info: 'border-blue-200 bg-white shadow-card',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-200 animate-slideUp',
        borders[toast.type]
      )}
      role="alert"
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        {toast.title && <h4 className="text-sm font-semibold text-slate-900 mb-0.5">{toast.title}</h4>}
        <p className="text-xs text-slate-600 leading-relaxed break-words">{toast.message}</p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 p-1 -mr-1 -mt-1 rounded-md transition-colors"
        aria-label="Dismiss notice"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
