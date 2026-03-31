"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, Badge } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/helpers";
import { Plus, Trash2, Clock, Users } from "lucide-react";

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
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    slot_date: "",
    start_time: "10:00",
    end_time: "10:30",
    max_capacity: "1",
  });
  const supabase = createClient();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from("available_slots").insert({
      healer_id: null, // Allow system-wide unassigned slots
      slot_date: form.slot_date,
      start_time: form.start_time,
      end_time: form.end_time,
      max_capacity: parseInt(form.max_capacity) || 1,
      current_bookings: 0,
      is_booked: false,
    });
    setShowModal(false);
    setForm({ slot_date: "", start_time: "10:00", end_time: "10:30", max_capacity: "1" });
    load();
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
            setForm({ slot_date: "", start_time: "10:00", end_time: "10:30", max_capacity: "1" });
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
          <div>
            <label className="block text-sm font-medium mb-1.5">التاريخ *</label>
            <input
              required
              type="date"
              value={form.slot_date}
              onChange={(e) => setForm({ ...form, slot_date: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">من الساعة</label>
              <input type="time" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">إلى الساعة</label>
              <input type="time" value={form.end_time} onChange={(e) => setForm({ ...form, end_time: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">السعة القصوى (عدد الحجوزات المتزامنة)</label>
            <input
              type="number"
              min="1"
              max="50"
              value={form.max_capacity}
              onChange={(e) => setForm({ ...form, max_capacity: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="text-xs text-text-muted mt-1">كم حجز يمكن استقباله في نفس الموعد</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-gray-50">إلغاء</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light">إضافة</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
