"use client";

import { HTMLAttributes, ReactNode } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

export default function Badge({
  variant = "default",
  size = "md",
  children,
  className = "",
  ...props
}: BadgeProps) {
  const baseClasses = "inline-flex items-center font-bold rounded-full border";

  const variantClasses = {
    default: "bg-hti-teal/10 text-hti-teal border-hti-teal/30",
    success: "bg-hti-teal/10 text-hti-teal border-hti-teal/30",
    warning: "bg-hti-yellow/15 text-hti-navy border-hti-yellow/40",
    error: "bg-hti-red/15 text-hti-red border-hti-red/40",
    info: "bg-hti-teal-light/15 text-hti-teal border-hti-teal-light/40",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  return (
    <span
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
