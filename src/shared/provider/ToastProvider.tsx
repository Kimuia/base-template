'use client';

import {
  createContext,
  use,
  useReducer,
  useRef,
  useEffect,
  type ReactNode,
} from 'react';
import { cn } from '@/shared/utils/cn';

// Types
export type ToastVariant = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

export interface ToastContextValue {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

// Reducer actions
type ToastAction =
  | { type: 'ADD'; payload: Toast }
  | { type: 'REMOVE'; payload: number };

// Context
const ToastContext = createContext<ToastContextValue | null>(null);

// Reducer
function toastReducer(state: Toast[], action: ToastAction): Toast[] {
  switch (action.type) {
    case 'ADD':
      return [...state, action.payload];
    case 'REMOVE':
      return state.filter((toast) => toast.id !== action.payload);
    default:
      return state;
  }
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  success: 'bg-green-600',
  error: 'bg-red-600',
  info: 'bg-gray-800',
};

// ToastItem internal component
interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: number) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, toast.duration);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      role="alert"
      aria-atomic="true"
      className={cn(
        'min-w-[300px] animate-[slide-in-right_0.2s_ease-out] rounded-lg px-4 py-3 text-white shadow-lg',
        VARIANT_STYLES[toast.variant],
      )}
    >
      {toast.message}
    </div>
  );
}

// Provider
interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  const [toasts, dispatch] = useReducer(toastReducer, []);
  const counterRef = useRef(0);

  const addToast = (
    message: string,
    variant: ToastVariant,
    duration = 3000,
  ) => {
    const id = counterRef.current++;
    dispatch({
      type: 'ADD',
      payload: { id, message, variant, duration },
    });
  };

  const removeToast = (id: number) => {
    dispatch({ type: 'REMOVE', payload: id });
  };

  const contextValue: ToastContextValue = {
    success: (message: string, duration?: number) =>
      addToast(message, 'success', duration),
    error: (message: string, duration?: number) =>
      addToast(message, 'error', duration),
    info: (message: string, duration?: number) =>
      addToast(message, 'info', duration),
  };

  return (
    <ToastContext value={contextValue}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="fixed right-4 bottom-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
        ))}
      </div>
    </ToastContext>
  );
}

// Hook — React 19: use() replaces useContext() (supports conditional calls)
export function useToast(): ToastContextValue {
  const context = use(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}
