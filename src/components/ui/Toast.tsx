"use client";

import { useEffect, useState } from "react";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastProps {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: "bg-green-50 border-green-200 text-green-900",
  error: "bg-red-50 border-red-200 text-red-900",
  info: "bg-blue-50 border-blue-200 text-blue-900",
  warning: "bg-yellow-50 border-yellow-200 text-yellow-900",
};

const iconColors = {
  success: "text-green-500",
  error: "text-red-500",
  info: "text-blue-500",
  warning: "text-yellow-500",
};

export function Toast({ id, type, message, description, duration = 5000, onClose }: ToastProps) {
  const [isExiting, setIsExiting] = useState(false);
  const Icon = icons[type];

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onClose(id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <div
      className={`${colors[type]} border rounded-lg shadow-lg p-4 mb-3 transition-all duration-300 ${
        isExiting ? "opacity-0 translate-x-full" : "opacity-100 translate-x-0"
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-5 h-5 ${iconColors[type]} flex-shrink-0 mt-0.5`} />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">{message}</p>
          {description && <p className="text-sm mt-1 opacity-100">{description}</p>}
        </div>
        <button
          onClick={() => {
            setIsExiting(true);
            setTimeout(() => onClose(id), 300);
          }}
          className="text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Toast Container
export function ToastContainer({ toasts }: { toasts: ToastProps[] }) {
  return (
    <div className="fixed top-20 right-4 z-50 w-full max-w-md pointer-events-none">
      <div className="pointer-events-auto space-y-2">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </div>
  );
}

// Toast Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const showToast = (
    type: ToastType,
    message: string,
    description?: string,
    duration?: number
  ) => {
    const id = Math.random().toString(36).substring(7);
    const newToast: ToastProps = {
      id,
      type,
      message,
      description,
      duration,
      onClose: removeToast,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  return {
    toasts,
    showToast,
    success: (msg: string, desc?: string) => showToast("success", msg, desc),
    error: (msg: string, desc?: string) => showToast("error", msg, desc),
    info: (msg: string, desc?: string) => showToast("info", msg, desc),
    warning: (msg: string, desc?: string) => showToast("warning", msg, desc),
  };
}
