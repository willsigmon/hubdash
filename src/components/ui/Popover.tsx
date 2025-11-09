"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface PopoverProps {
  children: React.ReactNode;
  trigger: React.ReactNode;
  title?: string;
  onClose?: () => void;
  position?: "top" | "bottom" | "left" | "right" | "center";
  size?: "sm" | "md" | "lg" | "xl";
}

export default function Popover({
  children,
  trigger,
  title,
  onClose,
  position = "center",
  size = "md",
}: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-2xl",
  };

  const positionClasses = {
    center: "fixed inset-0 flex items-center justify-center",
    top: "fixed top-4 left-1/2 -translate-x-1/2",
    bottom: "fixed bottom-4 left-1/2 -translate-x-1/2",
    left: "fixed left-4 top-1/2 -translate-y-1/2",
    right: "fixed right-4 top-1/2 -translate-y-1/2",
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onClose?.();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        onClose?.();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <div
            ref={popoverRef}
            className={`${positionClasses[position]} z-50 p-4`}
          >
            <div
              className={`${sizeClasses[size]} w-full bg-surface rounded-2xl border-2 border-default shadow-2xl overflow-hidden`}
            >
              {title && (
                <div className="px-6 py-4 border-b border-default bg-surface-alt flex items-center justify-between">
                  <h3 className="text-xl font-black text-primary">{title}</h3>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      onClose?.();
                    }}
                    className="p-2 hover:bg-surface rounded-lg transition-colors"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-secondary" />
                  </button>
                </div>
              )}
              <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

