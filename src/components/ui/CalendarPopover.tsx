"use client";

import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface CalendarPopoverProps {
  trigger: React.ReactNode;
  onSelectDate: (date: Date) => void;
  onClose?: () => void;
  minDate?: Date;
  maxDate?: Date;
}

export default function CalendarPopover({
  trigger,
  onSelectDate,
  onClose,
  minDate,
  maxDate,
}: CalendarPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const min = minDate || today;
  const max = maxDate || new Date(today.getFullYear() + 1, 11, 31);

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  };

  const isDateDisabled = (date: Date) => {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);
    return dateOnly < min || dateOnly > max;
  };

  const isDateSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const handleDateClick = (date: Date) => {
    if (isDateDisabled(date)) return;
    setSelectedDate(date);
  };

  const handleConfirm = () => {
    if (selectedDate) {
      onSelectDate(selectedDate);
      setIsOpen(false);
      setSelectedDate(null);
      onClose?.();
    }
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
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
        setSelectedDate(null);
        onClose?.();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSelectedDate(null);
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

  const days = getDaysInMonth(currentMonth);

  return (
    <>
      <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              ref={popoverRef}
              className="bg-surface rounded-2xl border-2 border-default shadow-2xl max-w-sm w-full overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-default bg-surface-alt flex items-center justify-between">
                <h3 className="text-xl font-black text-primary">Select Pickup Date</h3>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    setSelectedDate(null);
                    onClose?.();
                  }}
                  className="p-2 hover:bg-surface rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-secondary" />
                </button>
              </div>

              {/* Calendar */}
              <div className="p-6">
                {/* Month Navigation */}
                <div className="flex items-center justify-between mb-6">
                  <button
                    onClick={handlePreviousMonth}
                    className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
                    aria-label="Previous month"
                  >
                    <ChevronLeft className="w-5 h-5 text-secondary" />
                  </button>
                  <div className="text-lg font-black text-primary">
                    {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </div>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-surface-alt rounded-lg transition-colors"
                    aria-label="Next month"
                  >
                    <ChevronRight className="w-5 h-5 text-secondary" />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {daysOfWeek.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-black text-secondary py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {days.map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="aspect-square" />;
                    }

                    const disabled = isDateDisabled(date);
                    const selected = isDateSelected(date);
                    const isTodayDate = isToday(date);

                    return (
                      <button
                        key={date.toISOString()}
                        onClick={() => handleDateClick(date)}
                        disabled={disabled}
                        className={`
                          aspect-square rounded-lg text-sm font-semibold transition-all
                          ${disabled
                            ? "text-muted cursor-not-allowed opacity-30"
                            : selected
                              ? "bg-accent text-on-accent shadow-lg scale-105"
                              : isTodayDate
                                ? "bg-soft-accent text-accent border-2 border-accent font-black"
                                : "text-primary hover:bg-surface-alt hover:scale-105"
                          }
                        `}
                      >
                        {date.getDate()}
                      </button>
                    );
                  })}
                </div>

                {/* Selected Date Display */}
                {selectedDate && (
                  <div className="mt-6 pt-6 border-t border-default">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-secondary uppercase tracking-wide mb-1">
                          Selected Date
                        </div>
                        <div className="text-lg font-black text-primary">
                          {selectedDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <button
                        onClick={handleConfirm}
                        className="accent-gradient text-on-accent px-6 py-3 rounded-xl font-black hover:shadow-lg transition-all"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

