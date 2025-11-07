"use client";

import { ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  tone?: "default" | "warning" | "error";
}

const toneStyles: Record<NonNullable<EmptyStateProps["tone"]>, string> = {
  default: "border-white/20",
  warning: "border-hti-yellow/30 bg-hti-yellow/5",
  error: "border-hti-red/30 bg-hti-red/5",
};

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  tone = "default",
}: EmptyStateProps) {
  return (
    <div
      className={`glass-card glass-card--subtle shadow-glass border ${toneStyles[tone]} px-6 py-10 text-center space-y-3`}
      role="status"
    >
      {icon && <div className="mx-auto text-3xl">{icon}</div>}
      <h3 className="text-lg font-semibold text-glass-bright">{title}</h3>
      {description && (
        <p className="text-sm text-glass-muted max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="glass-button glass-button--accent text-xs"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

