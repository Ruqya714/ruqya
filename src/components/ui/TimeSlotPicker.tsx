"use client";

import { Clock, User } from "lucide-react";
import { formatTime } from "@/lib/helpers";

export interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  healer_name: string;
}

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlotId: string | null;
  onSelectSlot: (slotId: string) => void;
  isLoading?: boolean;
}

export default function TimeSlotPicker({
  slots,
  selectedSlotId,
  onSelectSlot,
  isLoading = false,
}: TimeSlotPickerProps) {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-2" />
        <p className="text-xs text-text-muted">جاري تحميل المواعيد...</p>
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border p-6 text-center">
        <Clock size={24} className="text-text-muted mx-auto mb-2" />
        <p className="text-sm text-text-secondary">
          لا توجد مواعيد متاحة في هذا اليوم
        </p>
        <p className="text-xs text-text-muted mt-1">
          جرب اختيار تاريخ آخر من التقويم
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-border p-4">
      <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
        <Clock size={16} className="text-primary" />
        المواعيد المتاحة ({slots.length})
      </h4>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {slots.map((slot) => {
          const isSelected = selectedSlotId === slot.id;
          return (
            <button
              key={slot.id}
              onClick={() => onSelectSlot(slot.id)}
              className={`
                relative p-3 rounded-lg border-2 text-center transition-all duration-200
                ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/30 hover:bg-gray-50"
                }
              `}
            >
              <p
                className={`text-sm font-bold ${
                  isSelected ? "text-primary" : "text-text-primary"
                }`}
              >
                {formatTime(slot.start_time)}
              </p>
              <p className="text-[10px] text-text-muted mt-0.5">
                إلى {formatTime(slot.end_time)}
              </p>
              {slot.healer_name && (
                <div className="flex items-center justify-center gap-1 mt-1.5">
                  <User size={10} className="text-text-muted" />
                  <span className="text-[10px] text-text-secondary truncate">
                    {slot.healer_name}
                  </span>
                </div>
              )}
              {isSelected && (
                <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 10 10"
                    fill="none"
                    className="text-white"
                  >
                    <path
                      d="M2 5L4 7L8 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
