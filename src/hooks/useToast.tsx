import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type ToastType = 'success' | 'danger' | 'warning' | 'info';

export interface ToastItem {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastItem[];
  showToast: (options: { type?: ToastType; title?: string; message: string; duration?: number }) => void;
  removeToast: (id: string) => void;
  success: (message: string, title?: string) => void;
  danger: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({
      type = 'info',
      title,
      message,
      duration = 4000,
    }: {
      type?: ToastType;
      title?: string;
      message: string;
      duration?: number;
    }) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast: ToastItem = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback(
    (message: string, title?: string) => showToast({ type: 'success', title, message }),
    [showToast]
  );
  const danger = useCallback(
    (message: string, title?: string) => showToast({ type: 'danger', title, message }),
    [showToast]
  );
  const warning = useCallback(
    (message: string, title?: string) => showToast({ type: 'warning', title, message }),
    [showToast]
  );
  const info = useCallback(
    (message: string, title?: string) => showToast({ type: 'info', title, message }),
    [showToast]
  );

  const value = useMemo(
    () => ({
      toasts,
      showToast,
      removeToast,
      success,
      danger,
      warning,
      info,
    }),
    [toasts, showToast, removeToast, success, danger, warning, info]
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
