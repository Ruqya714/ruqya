/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, Badge } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/helpers";
import { Plus, Trash2, Clock, Users } from "lucide-react";

const DAYS_OF_WEEK = [
  { value: 0, label: "الأحد" },
  { value: 1, label: "الإثنين" },
  { value: 2, label: "الثلاثاء" },
  { value: 3, label: "الأربعاء" },
  { value: 4, label: "الخميس" },
  { value: 5, label: "الجمعة" },
  { value: 6, label: "السبت" },
];

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

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
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

  const generateTimeSlots = (startStr: string, endStr: string, durationMin: number) => {
    const createdSlots = [];
    const [startH, startM] = startStr.split(':').map(Number);
    const [endH, endM] = endStr.split(':').map(Number);
    
    let current = startH * 60 + startM;
    const end = endH * 60 + endM;

    while (current + durationMin <= end) {
      const h1 = Math.floor(current / 60).toString().padStart(2, '0');
      const m1 = (current % 60).toString().padStart(2, '0');
      
      const next = current + durationMin;
      const h2 = Math.floor(next / 60).toString().padStart(2, '0');
      const m2 = (next % 60).toString().padStart(2, '0');
      
      createdSlots.push({ start_time: `${h1}:${m1}`, end_time: `${h2}:${m2}` });
      current = next;
    }
    return createdSlots;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.start_date || !form.end_date) {
      alert("يرجى تحديد تاريخ البداية والنهاية"); return;
    }
    if (form.days.length === 0) {
      alert("يرجى تحديد يوم واحد على الأقل من أيام الأسبوع"); return;
    }

    const duration = parseInt(form.slot_duration);
    if (!duration || duration < 5) {
      alert("يجب أن تكون مدة الجلسة 5 دقائق على الأقل"); return;
    }

    const start = new Date(form.start_date);
    const end = new Date(form.end_date);
    
    const timeSlots = generateTimeSlots(form.start_time, form.end_time, duration);
    if (timeSlots.length === 0) {
      alert("المدة وأوقات العمل المحددة لا تسمح بإنشاء أوقات صحيحة.");
      return;
    }

    setIsSubmitting(true);

    // Fetch existing slots to avoid duplicates preventing the whole insert batch from succeeding
    const { data: existingSlots } = await supabase
      .from("available_slots")
      .select("slot_date, start_time")
      .gte("slot_date", form.start_date)
      .lte("slot_date", form.end_date);
    
    const existingSet = new Set(existingSlots?.map(s => `${s.slot_date}-${s.start_time.substring(0,5)}`) || []);

    const inserts = [];

    // Loop through dates
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
      setForm({ start_date: "", end_date: "", start_time: "09:00", end_time: "17:00", slot_duration: "30", max_capacity: "1", days: [] });
      load();
    }
  };

  const deleteSlot = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الموعد؟")) return;
    await supabase.from("available_slots").delete().eq("id", id);
    load();
  };

  const today = new Date().toISOString().split("T")[0];
  const upcoming = slots.filter((s) => s.slot_date >= today);
  const past = slots.filter((s) => s.slot_date < today);

  const getCapacityBadge = (s: Slot) => {
    const remaining = s.max_capacity - s.current_bookings;
    if (remaining <= 0) return <Badge variant="error">مكتمل</Badge>;
    if (remaining === 1) return <Badge variant="warning">متبقي 1</Badge>;
    return <Badge variant="success">متاح {remaining}/{s.max_capacity}</Badge>;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة المواعيد</h1>
          <p className="text-text-secondary text-sm mt-1">{slots.length} موعد</p>
        </div>
        <button
          onClick={() => {
            setForm({ start_date: "", end_date: "", start_time: "09:00", end_time: "17:00", slot_duration: "30", max_capacity: "1", days: [] });
            setShowModal(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all"
        >
          <Plus size={16} /> إضافة موعد
        </button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Upcoming */}
          <div>
            <h2 className="font-semibold text-text-primary mb-3">المواعيد القادمة ({upcoming.length})</h2>
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              {upcoming.length === 0 ? (
                <div className="py-8 text-center text-text-secondary text-sm">لا توجد مواعيد قادمة</div>
              ) : (
                <div className="divide-y divide-border">
                  {upcoming.map((s) => (
                    <div key={s.id} className="flex items-center gap-4 px-5 py-3 hover:bg-gray-50/50">
                      <Clock size={16} className="text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary">
                          {formatDate(s.slot_date)} — {formatTime(s.start_time)} إلى {formatTime(s.end_time)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-text-muted flex-shrink-0">
                        <Users size={12} />
                        <span>{s.current_bookings}/{s.max_capacity}</span>
                      </div>
                      {getCapacityBadge(s)}
                      <button
                        onClick={() => deleteSlot(s.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600 flex-shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 className="font-semibold text-text-secondary mb-3">المواعيد السابقة ({past.length})</h2>
              <div className="bg-white rounded-xl border border-border overflow-hidden opacity-60">
                <div className="divide-y divide-border">
                  {past.slice(0, 10).map((s) => (
                    <div key={s.id} className="flex items-center gap-4 px-5 py-3">
                      <Clock size={16} className="text-text-muted flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm text-text-secondary">{formatDate(s.slot_date)} — {formatTime(s.start_time)}</p>
                      </div>
                      <span className="text-xs text-text-muted">{s.current_bookings}/{s.max_capacity} حجز</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

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
                min={form.start_date} // end date shouldn't be before start date
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
          
          <h3 className="text-sm font-semibold border-b border-border pb-2 mt-2">ساعات العمل في الأيام المحددة</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">يبدأ العمل الساعة</label>
              <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">وينتهي الساعة</label>
              <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-gray-50">إلغاء</button>
            <button type="submit" disabled={isSubmitting} className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50">
              {isSubmitting ? "جاري الإضافة..." : "إضافة المواعيد"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
