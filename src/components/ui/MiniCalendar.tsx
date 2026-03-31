"use client";

import { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

const ARABIC_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

const ARABIC_DAYS = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

interface MiniCalendarProps {
  availableDates: string[]; // array of "YYYY-MM-DD"
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function MiniCalendar({
  availableDates,
  selectedDate,
  onSelectDate,
}: MiniCalendarProps) {
  const today = new Date();
  const todayKey = toDateKey(today);
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const availableSet = useMemo(() => new Set(availableDates), [availableDates]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentYear, currentMonth, 1).getDay();

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Don't allow navigating to past months
  const canGoPrev =
    currentYear > today.getFullYear() ||
    (currentYear === today.getFullYear() && currentMonth > today.getMonth());

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={nextMonth}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary transition-colors"
          aria-label="الشهر التالي"
        >
          <ChevronRight size={18} />
        </button>

        <h3 className="text-sm font-bold text-text-primary">
          {ARABIC_MONTHS[currentMonth]} {currentYear}
        </h3>

        <button
          onClick={prevMonth}
          disabled={!canGoPrev}
          className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="الشهر السابق"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {ARABIC_DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-[10px] font-medium text-text-muted py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateKey = toDateKey(
            new Date(currentYear, currentMonth, day)
          );
          const isAvailable = availableSet.has(dateKey);
          const isSelected = selectedDate === dateKey;
          const isPast = dateKey < todayKey;
          const isToday = dateKey === todayKey;

          return (
            <button
              key={dateKey}
              onClick={() => isAvailable && !isPast && onSelectDate(dateKey)}
              disabled={!isAvailable || isPast}
              className={`
                relative w-full aspect-square rounded-lg text-xs font-medium
                flex items-center justify-center transition-all duration-200
                ${
                  isSelected
                    ? "bg-primary text-white shadow-sm ring-2 ring-primary/30"
                    : isAvailable && !isPast
                    ? "bg-primary/5 text-primary hover:bg-primary/15 cursor-pointer"
                    : isPast
                    ? "text-gray-200 cursor-not-allowed"
                    : "text-text-muted cursor-not-allowed"
                }
                ${isToday && !isSelected ? "ring-1 ring-accent" : ""}
              `}
            >
              {day}
              {isAvailable && !isPast && !isSelected && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-border">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary/20" />
          <span className="text-[10px] text-text-muted">متاح</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span className="text-[10px] text-text-muted">تم الاختيار</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full ring-1 ring-accent" />
          <span className="text-[10px] text-text-muted">اليوم</span>
        </div>
      </div>
    </div>
  );
}
