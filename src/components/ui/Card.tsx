"use client";

import { HTMLAttributes, ReactNode } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "elevated" | "outlined";
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export default function Card({
  variant = "default",
  children,
  header,
  footer,
  className = "",
  ...props
}: CardProps) {
  const baseClasses = "rounded-xl bg-white";

  const variantClasses = {
    default: "shadow-lg border border-hti-navy/10",
    elevated: "shadow-2xl border border-hti-navy/15",
    outlined: "shadow-sm border border-hti-navy/10",
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {header && (
        <div className="p-6 border-b border-hti-navy/10">
          {header}
        </div>
      )}
      <div className={header || footer ? "p-6" : "p-6"}>
        {children}
      </div>
      {footer && (
        <div className="p-6 border-t border-hti-navy/10">
          {footer}
        </div>
      )}
    </div>
  );
}
