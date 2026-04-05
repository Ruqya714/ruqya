/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, Badge } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/helpers";
import {
  Plus,
  Trash2,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  Calendar,
  CalendarDays,
  Zap,
  AlertTriangle,
} from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الإثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
];

const DAY_NAMES: Record<number, string> = {
  0: "الأحد",
  1: "الإثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
  6: "السبت",
};

interface Slot {
  id: string;
  healer_id: string;
  slot_date: string;
  start_time: string;
  end_time: string;
  is_booked: boolean;
  max_capacity: number;
  current_bookings: number;
}

interface DayGroup {
  date: string;
  dayName: string;
  slots: Slot[];
  totalSlots: number;
  bookedSlots: number;
  availableSlots: number;
  totalCapacity: number;
  totalBookings: number;
  firstTime: string;
  lastTime: string;
}

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());
  const [deletingDayDate, setDeletingDayDate] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [dayToDelete, setDayToDelete] = useState<DayGroup | null>(null);
  const [form, setForm] = useState({
    start_date: "",
    end_date: "",
    start_time: "09:00",
    end_time: "17:00",
    slot_duration: "30",
    max_capacity: "1",
    days: [] as number[],
  });
  const supabase = createClient();

  const toggleDay = (day: number) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter((d) => d !== day) : [...prev.days, day],
    }));
  };

  const toggleExpanded = (date: string) => {
    setExpandedDays((prev) => {
      const next = new Set(prev);
      if (next.has(date)) {
        next.delete(date);
      } else {
        next.add(date);
      }
      return next;
    });
  };

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase
      .from("available_slots")
      .select("*")
      .order("slot_date", { ascending: true })
      .order("start_time", { ascending: true });

    setSlots((data as unknown as Slot[]) || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => {
    load();
  }, [load]);

  // Group slots by date
  const today = new Date().toISOString().split("T")[0];

  const groupSlotsByDate = useCallback(
    (slotsToGroup: Slot[]): DayGroup[] => {
      const groups: Record<string, Slot[]> = {};
      for (const slot of slotsToGroup) {
        if (!groups[slot.slot_date]) groups[slot.slot_date] = [];
        groups[slot.slot_date].push(slot);
      }

      return Object.entries(groups)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, daySlots]) => {
          const dayOfWeek = new Date(date + "T00:00:00").getDay();
          const bookedSlots = daySlots.filter(
            (s) => s.current_bookings >= s.max_capacity
          ).length;

          return {
            date,
            dayName: DAY_NAMES[dayOfWeek] || "",
            slots: daySlots,
            totalSlots: daySlots.length,
            bookedSlots,
            availableSlots: daySlots.length - bookedSlots,
            totalCapacity: daySlots.reduce((sum, s) => sum + s.max_capacity, 0),
            totalBookings: daySlots.reduce((sum, s) => sum + s.current_bookings, 0),
            firstTime: daySlots[0]?.start_time || "",
            lastTime: daySlots[daySlots.length - 1]?.end_time || "",
          };
        });
    },
    []
  );

  const upcomingGroups = useMemo(
    () => groupSlotsByDate(slots.filter((s) => s.slot_date >= today)),
    [slots, today, groupSlotsByDate]
  );
  const pastGroups = useMemo(
    () => groupSlotsByDate(slots.filter((s) => s.slot_date < today)),
    [slots, today, groupSlotsByDate]
  );

  const totalUpcomingSlots = upcomingGroups.reduce((s, g) => s + g.totalSlots, 0);
  const totalBookedSlots = upcomingGroups.reduce((s, g) => s + g.bookedSlots, 0);
  const totalAvailableSlots = upcomingGroups.reduce((s, g) => s + g.availableSlots, 0);

  const generateTimeSlots = (startStr: string, endStr: string, durationMin: number) => {
    const createdSlots = [];
    const [startH, startM] = startStr.split(":").map(Number);
    const [endH, endM] = endStr.split(":").map(Number);

    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + durationMin <= end) {
      const h1 = Math.floor(current / 60)
        .toString()
        .padStart(2, "0");
      const m1 = (current % 60).toString().padStart(2, "0");

      const next = current + durationMin;
      const h2 = Math.floor(next / 60)
        .toString()
        .padStart(2, "0");
      const m2 = (next % 60).toString().padStart(2, "0");

      createdSlots.push({ start_time: `${h1}:${m1}`, end_time: `${h2}:${m2}` });
      current = next;
    }
    return createdSlots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.start_date || !form.end_date) {
      alert("يرجى تحديد تاريخ البداية والنهاية");
      return;
    }
    if (form.days.length === 0) {
      alert("يرجى تحديد يوم واحد على الأقل من أيام الأسبوع");
      return;
    }

    const duration = parseInt(form.slot_duration);
    if (!duration || duration < 5) {
      alert("يجب أن تكون مدة الجلسة 5 دقائق على الأقل");
      return;
    }

    const start = new Date(form.start_date);
    const end = new Date(form.end_date);

    const timeSlots = generateTimeSlots(form.start_time, form.end_time, duration);
    if (timeSlots.length === 0) {
      alert("المدة وأوقات العمل المحددة لا تسمح بإنشاء أوقات صحيحة.");
      return;
    }

    setIsSubmitting(true);

    // Fetch existing slots to avoid duplicates
    const { data: existingSlots } = await supabase
      .from("available_slots")
      .select("slot_date, start_time")
      .gte("slot_date", form.start_date)
      .lte("slot_date", form.end_date);

    const existingSet = new Set(
      existingSlots?.map((s) => `${s.slot_date}-${s.start_time.substring(0, 5)}`) || []
    );

    const inserts = [];

    let current = new Date(start);
    while (current <= end) {
      if (form.days.includes(current.getDay())) {
        const dateStr = current.toISOString().split("T")[0];

        for (const t of timeSlots) {
          const key = `${dateStr}-${t.start_time}`;
          if (!existingSet.has(key)) {
            inserts.push({
              healer_id: null,
              slot_date: dateStr,
              start_time: t.start_time,
              end_time: t.end_time,
              max_capacity: parseInt(form.max_capacity) || 1,
              current_bookings: 0,
              is_booked: false,
            });
          }
        }
      }
      current.setDate(current.getDate() + 1);
    }

    if (inserts.length === 0) {
      alert("لا يوجد مواعيد جديدة لإضافتها. إما أن الأيام لا تتطابق، أو تم إضافة كل هذه المواعيد مسبقاً.");
      setIsSubmitting(false);
      return;
    }

    const { error } = await supabase.from("available_slots").insert(inserts);
    setIsSubmitting(false);

    if (error) {
      console.error(error);
      alert("حدث خطأ أثناء إضافة المواعيد.");
    } else {
      setShowModal(false);
      setForm({
        start_date: "",
        end_date: "",
        start_time: "09:00",
        end_time: "17:00",
        slot_duration: "30",
        max_capacity: "1",
        days: [],
      });
      load();
    }
  };

  const deleteSlot = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموعد؟")) return;
    await supabase.from("available_slots").delete().eq("id", id);
    load();
  };

  const confirmDeleteDay = (group: DayGroup) => {
    setDayToDelete(group);
    setShowDeleteConfirm(true);
  };

  const deleteEntireDay = async () => {
    if (!dayToDelete) return;
    setDeletingDayDate(dayToDelete.date);
    setShowDeleteConfirm(false);

    const slotIds = dayToDelete.slots.map((s) => s.id);
    await supabase.from("available_slots").delete().in("id", slotIds);

    setDeletingDayDate(null);
    setDayToDelete(null);
    load();
  };

  const getGroupStatus = (group: DayGroup) => {
    if (group.availableSlots === 0)
      return { label: "مكتمل بالكامل", variant: "error" as const, icon: "🔴" };
    if (group.bookedSlots > 0)
      return { label: "محجوز جزئياً", variant: "warning" as const, icon: "🟡" };
    return { label: "متاح بالكامل", variant: "success" as const, icon: "🟢" };
  };

  const getSlotBadge = (s: Slot) => {
    const remaining = s.max_capacity - s.current_bookings;
    if (remaining <= 0) return <Badge variant="error">مكتمل</Badge>;
    if (remaining === 1) return <Badge variant="warning">متبقي 1</Badge>;
    return (
      <Badge variant="success">
        متاح {remaining}/{s.max_capacity}
      </Badge>
    );
  };

  // ─── RENDER ───

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة المواعيد</h1>
          <p className="text-text-secondary text-sm mt-1">{slots.length} موعد</p>
        </div>
        <button
          onClick={() => {
            setForm({
              start_date: "",
              end_date: "",
              start_time: "09:00",
              end_time: "17:00",
              slot_duration: "30",
              max_capacity: "1",
              days: [],
            });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all"
        >
          <Plus size={16} /> إضافة موعد
        </button>
      </div>

      {/* Stats Summary */}
      {!isLoading && upcomingGroups.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <CalendarDays size={16} className="text-primary" />
              <span className="text-xs text-text-muted">أيام قادمة</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{upcomingGroups.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-blue-500" />
              <span className="text-xs text-text-muted">إجمالي الاستشارات</span>
            </div>
            <p className="text-2xl font-bold text-text-primary">{totalUpcomingSlots}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users size={16} className="text-amber-500" />
              <span className="text-xs text-text-muted">محجوزة</span>
            </div>
            <p className="text-2xl font-bold text-amber-600">{totalBookedSlots}</p>
          </div>
          <div className="bg-white rounded-xl border border-border p-4">
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} className="text-green-500" />
              <span className="text-xs text-text-muted">متاحة</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{totalAvailableSlots}</p>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming Days */}
          <div>
            <h2 className="font-semibold text-text-primary mb-3">
              المواعيد القادمة ({upcomingGroups.length} يوم)
            </h2>

            {upcomingGroups.length === 0 ? (
              <div className="bg-white rounded-xl border border-border py-12 text-center">
                <Calendar size={40} className="text-text-muted mx-auto mb-3" />
                <p className="text-sm text-text-secondary">لا توجد مواعيد قادمة</p>
                <p className="text-xs text-text-muted mt-1">
                  اضغط &quot;إضافة موعد&quot; لإنشاء مواعيد جديدة
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingGroups.map((group) => {
                  const isExpanded = expandedDays.has(group.date);
                  const status = getGroupStatus(group);
                  const progressPercent =
                    group.totalSlots > 0
                      ? Math.round((group.bookedSlots / group.totalSlots) * 100)
                      : 0;
                  const isDeleting = deletingDayDate === group.date;

                  return (
                    <div
                      key={group.date}
                      className={`bg-white rounded-xl border border-border overflow-hidden transition-all duration-200 ${
                        isExpanded ? "shadow-sm" : ""
                      } ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
                    >
                      {/* Day Summary Header */}
                      <div
                        className="flex items-center gap-4 px-5 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors"
                        onClick={() => toggleExpanded(group.date)}
                      >
                        {/* Date & Day */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-text-primary">
                              {formatDate(group.date)}
                            </span>
                            <span className="text-xs text-text-muted bg-gray-100 px-2 py-0.5 rounded-full">
                              {group.dayName}
                            </span>
                            <Badge variant={status.variant}>{status.label}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-text-muted">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {formatTime(group.firstTime)} — {formatTime(group.lastTime)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users size={12} />
                              {group.totalSlots} استشارة
                            </span>
                          </div>
                        </div>

                        {/* Mini Stats */}
                        <div className="hidden sm:flex items-center gap-3 flex-shrink-0">
                          <div className="text-center px-3">
                            <p className="text-lg font-bold text-green-600">{group.availableSlots}</p>
                            <p className="text-[10px] text-text-muted">متاح</p>
                          </div>
                          <div className="text-center px-3 border-s border-border">
                            <p className="text-lg font-bold text-amber-600">{group.bookedSlots}</p>
                            <p className="text-[10px] text-text-muted">محجوز</p>
                          </div>
                        </div>

                        {/* Progress Bar & Expand */}
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="hidden sm:block w-24">
                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  progressPercent >= 100
                                    ? "bg-red-400"
                                    : progressPercent >= 50
                                    ? "bg-amber-400"
                                    : "bg-green-400"
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <p className="text-[10px] text-text-muted text-center mt-0.5">
                              {progressPercent}% محجوز
                            </p>
                          </div>

                          {isExpanded ? (
                            <ChevronUp size={18} className="text-text-muted" />
                          ) : (
                            <ChevronDown size={18} className="text-text-muted" />
                          )}
                        </div>
                      </div>

                      {/* Expanded Detail */}
                      {isExpanded && (
                        <div className="border-t border-border bg-gray-50/30">
                          {/* Action bar */}
                          <div className="flex items-center justify-between px-5 py-2.5 bg-gray-50 border-b border-border">
                            <span className="text-xs text-text-muted">
                              {group.totalSlots} استشارة • {group.totalBookings}/{group.totalCapacity} حجز
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                confirmDeleteDay(group);
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 border border-red-200 transition-colors"
                            >
                              <Trash2 size={12} />
                              حذف اليوم كاملاً
                            </button>
                          </div>

                          {/* Individual Slots */}
                          <div className="divide-y divide-border">
                            {group.slots.map((s) => (
                              <div
                                key={s.id}
                                className="flex items-center gap-3 px-5 py-2.5 hover:bg-white/80 transition-colors"
                              >
                                <div
                                  className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                                    s.current_bookings >= s.max_capacity
                                      ? "bg-red-400"
                                      : "bg-green-400"
                                  }`}
                                />
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm text-text-primary font-medium">
                                    {formatTime(s.start_time)} — {formatTime(s.end_time)}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-text-muted flex-shrink-0">
                                  <Users size={11} />
                                  <span>
                                    {s.current_bookings}/{s.max_capacity}
                                  </span>
                                </div>
                                {getSlotBadge(s)}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteSlot(s.id);
                                  }}
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600 flex-shrink-0 transition-colors"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Past Days */}
          {pastGroups.length > 0 && (
            <div>
              <h2 className="font-semibold text-text-secondary mb-3">
                المواعيد السابقة ({pastGroups.length} يوم)
              </h2>
              <div className="space-y-2 opacity-60">
                {pastGroups.slice(0, 5).map((group) => (
                  <div
                    key={group.date}
                    className="bg-white rounded-xl border border-border px-5 py-3.5 flex items-center gap-4"
                  >
                    <Calendar size={16} className="text-text-muted flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-sm text-text-secondary font-medium">
                        {formatDate(group.date)}
                      </span>
                      <span className="text-xs text-text-muted ms-2">({group.dayName})</span>
                    </div>
                    <span className="text-xs text-text-muted flex-shrink-0">
                      {group.totalSlots} استشارة • {group.totalBookings} حجز
                    </span>
                  </div>
                ))}
                {pastGroups.length > 5 && (
                  <p className="text-xs text-text-muted text-center py-2">
                    + {pastGroups.length - 5} يوم إضافي
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Day Confirmation Modal */}
      <Modal
        isOpen={showDeleteConfirm}
        onClose={() => {
          setShowDeleteConfirm(false);
          setDayToDelete(null);
        }}
        title="تأكيد حذف اليوم"
        size="sm"
      >
        {dayToDelete && (
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-4">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <p className="text-sm text-text-primary font-medium mb-2">
              هل أنت متأكد من حذف كل مواعيد يوم{" "}
              <span className="text-primary font-bold">{formatDate(dayToDelete.date)}</span>؟
            </p>
            <p className="text-xs text-text-muted mb-1">
              سيتم حذف <strong>{dayToDelete.totalSlots}</strong> استشارة
            </p>
            {dayToDelete.bookedSlots > 0 && (
              <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs text-amber-700 font-medium">
                  ⚠️ تنبيه: يوجد {dayToDelete.bookedSlots} استشارة محجوزة في هذا اليوم!
                </p>
              </div>
            )}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setDayToDelete(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm hover:bg-gray-50 transition-colors"
              >
                إلغاء
              </button>
              <button
                onClick={deleteEntireDay}
                className="flex-1 px-4 py-2.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors"
              >
                حذف اليوم كاملاً
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Slots Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="إضافة موعد جديد">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">تاريخ البداية (من) *</label>
              <input
                required
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">تاريخ النهاية (إلى) *</label>
              <input
                required
                type="date"
                min={form.start_date}
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">أيام الأسبوع *</label>
            <div className="flex flex-wrap gap-2">
              {DAYS_OF_WEEK.map((day) => (
                <button
                  key={day.value}
                  type="button"
                  onClick={() => toggleDay(day.value)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition-all ${
                    form.days.includes(day.value)
                      ? "bg-primary text-white border-primary"
                      : "bg-white text-text-secondary border-border hover:border-primary/50"
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>

          <h3 className="text-sm font-semibold border-b border-border pb-2 mt-2">
            ساعات العمل في الأيام المحددة
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">يبدأ العمل الساعة</label>
              <input
                type="time"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">وينتهي الساعة</label>
              <input
                type="time"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">مدة الجلسة (بالدقائق)</label>
              <input
                type="number"
                min="5"
                step="5"
                value={form.slot_duration}
                onChange={(e) => setForm({ ...form, slot_duration: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-text-muted mt-1">يُقسم الوقت تلقائياً بناءً على المدة</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">الأشخاص بنفس الموعد</label>
              <input
                type="number"
                min="1"
                max="50"
                value={form.max_capacity}
                onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <p className="text-xs text-text-muted mt-1">كم حجز يمكن استقباله في نفس الجلسة</p>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-gray-50"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50"
            >
              {isSubmitting ? "جاري الإضافة..." : "إضافة المواعيد"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
