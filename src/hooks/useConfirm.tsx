import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

export type ConfirmTone = 'danger' | 'warning' | 'success' | 'info';

export interface ConfirmOptions {
  tone?: ConfirmTone;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  withReason?: boolean;
  reasonPlaceholder?: string;
  consequence?: string;
  consequenceTone?: 'danger' | 'warning' | 'info';
  singleButton?: boolean;
}

export interface ConfirmResult {
  confirmed: boolean;
  reason?: string;
}

interface ConfirmContextValue {
  confirmState: {
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (res: ConfirmResult) => void;
  } | null;
  confirm: (options: ConfirmOptions) => Promise<ConfirmResult>;
  closeConfirm: (result: ConfirmResult) => void;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    options: ConfirmOptions;
    resolve: (res: ConfirmResult) => void;
  } | null>(null);

  const resolverRef = useRef<((res: ConfirmResult) => void) | null>(null);

  const confirm = useCallback((options: ConfirmOptions): Promise<ConfirmResult> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setConfirmState({
        isOpen: true,
        options,
        resolve,
      });
    });
  }, []);

  const closeConfirm = useCallback((result: ConfirmResult) => {
    if (resolverRef.current) {
      resolverRef.current(result);
      resolverRef.current = null;
    }
    setConfirmState(null);
  }, []);

  return (
    <ConfirmContext.Provider value={{ confirmState, confirm, closeConfirm }}>
      {children}
    </ConfirmContext.Provider>
  );
};

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return ctx.confirm;
}

export function useConfirmState() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirmState must be used within a ConfirmProvider');
  }
  return {
    confirmState: ctx.confirmState,
    closeConfirm: ctx.closeConfirm,
  };
}
