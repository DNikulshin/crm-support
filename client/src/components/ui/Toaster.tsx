import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
}

const toasts: Toast[] = [];
const listeners: ((toasts: Toast[]) => void)[] = [];

const emit = () => {
  listeners.forEach(listener => listener([...toasts]));
};

const addToast = (toast: Omit<Toast, 'id'>) => {
  const id = Math.random().toString(36).substr(2, 9);
  toasts.push({ ...toast, id });
  emit();
  
  setTimeout(() => {
    removeToast(id);
  }, 5000);
};

const removeToast = (id: string) => {
  const index = toasts.findIndex(toast => toast.id === id);
  if (index > -1) {
    toasts.splice(index, 1);
    emit();
  }
};

export const toast = {
  success: (title: string, message?: string) => addToast({ type: 'success', title, message }),
  error: (title: string, message?: string) => addToast({ type: 'error', title, message }),
  warning: (title: string, message?: string) => addToast({ type: 'warning', title, message }),
  info: (title: string, message?: string) => addToast({ type: 'info', title, message }),
};

const ToastIcon = ({ type }: { type: ToastType }) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    case 'warning':
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
  }
};

const ToastItem: React.FC<{ toast: Toast; onRemove: (id: string) => void }> = ({ toast, onRemove }) => {
  const bgColor = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200',
  }[toast.type];

  return (
    <div className={`max-w-sm w-full ${bgColor} border rounded-lg p-4 shadow-lg`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <ToastIcon type={toast.type} />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm text-gray-500">{toast.message}</p>
          )}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            onClick={() => onRemove(toast.id)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const Toaster: React.FC = () => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (newToasts: Toast[]) => {
      setToastList(newToasts);
    };
    
    listeners.push(listener);
    
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 z-50 p-6 space-y-4">
      {toastList.map(toast => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
        />
      ))}
    </div>
  );
};