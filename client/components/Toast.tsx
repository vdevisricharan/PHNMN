'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '@/redux/store';
import { CheckCircleIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

// Simple toast slice - could be moved to a separate file
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialToastState: ToastState = {
  toasts: []
};

const toastSlice = createSlice({
  name: 'toast',
  initialState: initialToastState,
  reducers: {
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        duration: action.payload.duration || 4000
      };
      state.toasts.push(toast);
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    clearAllToasts: (state) => {
      state.toasts = [];
    }
  }
});

export const { addToast, removeToast, clearAllToasts } = toastSlice.actions;
export const toastReducer = toastSlice.reducer;

// Toast Component
export function ToastContainer() {
  const toasts = useSelector((state: RootState) => (state as any).toast?.toasts || []);
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast: Toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => dispatch(removeToast(toast.id))}
        />
      ))}
    </div>
  );
}

interface ToastItemProps {
  toast: Toast;
  onRemove: () => void;
}

function ToastItem({ toast, onRemove }: ToastItemProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto remove after duration
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onRemove, 300); // Wait for exit animation
    }, toast.duration || 4000);

    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-500" />;
      case 'error':
        return <ExclamationCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <ExclamationCircleIcon className="w-5 h-5 text-blue-500" />;
    }
  };

  const getBgColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (toast.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      default:
        return 'text-blue-800';
    }
  };

  return (
    <div
      className={`
        ${getBgColor()} ${getTextColor()}
        border p-4 rounded-lg shadow-lg max-w-sm w-full
        transform transition-all duration-300 ease-in-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">
            {toast.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={() => {
              setIsVisible(false);
              setTimeout(onRemove, 300);
            }}
            className={`
              inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2
              ${toast.type === 'success' ? 'text-green-400 hover:text-green-500 focus:ring-green-500' : ''}
              ${toast.type === 'error' ? 'text-red-400 hover:text-red-500 focus:ring-red-500' : ''}
              ${toast.type === 'info' ? 'text-blue-400 hover:text-blue-500 focus:ring-blue-500' : ''}
            `}
          >
            <span className="sr-only">Close</span>
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for using toasts
export function useToast() {
  const dispatch = useDispatch<AppDispatch>();

  const toast = {
    success: (message: string, duration?: number) => {
      dispatch(addToast({ message, type: 'success', duration }));
    },
    error: (message: string, duration?: number) => {
      dispatch(addToast({ message, type: 'error', duration }));
    },
    info: (message: string, duration?: number) => {
      dispatch(addToast({ message, type: 'info', duration }));
    }
  };

  return toast;
} 