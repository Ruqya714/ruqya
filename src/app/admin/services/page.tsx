"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  icon: string;
  duration_minutes: number;
  display_order: number;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({ name: "", description: "", icon: "Phone", duration_minutes: "30", display_order: "1" });

  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("services").select("*").order("display_order");
    setServices(data || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", description: "", icon: "Phone", duration_minutes: "30", display_order: String(services.length + 1) });
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description || "", icon: s.icon || "Phone", duration_minutes: String(s.duration_minutes), display_order: String(s.display_order) });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { name: form.name, description: form.description, icon: form.icon, duration_minutes: parseInt(form.duration_minutes), display_order: parseInt(form.display_order) };
    if (editing) {
      await supabase.from("services").update(data).eq("id", editing.id);
    } else {
      await supabase.from("services").insert(data);
    }
    setShowModal(false);
    load();
  };

  const deleteService = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الخدمة؟")) return;
    await supabase.from("services").delete().eq("id", id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة الخدمات</h1>
          <p className="text-text-secondary text-sm mt-1">{services.length} خدمة</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all">
          <Plus size={16} /> إضافة خدمة
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : services.length === 0 ? (
          <div className="py-12 text-center text-text-secondary">لا توجد خدمات</div>
        ) : (
          <div className="divide-y divide-border">
            {services.map((s) => (
              <div key={s.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <GripVertical size={16} className="text-text-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary">{s.name}</p>
                  <p className="text-sm text-text-secondary truncate">{s.description}</p>
                </div>
                <span className="text-xs text-text-muted hidden sm:block">{s.duration_minutes} دقيقة</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(s)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary transition-colors"><Pencil size={14} /></button>
                  <button onClick={() => deleteService(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "تعديل الخدمة" : "إضافة خدمة جديدة"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">اسم الخدمة *</label>
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الوصف</label>
            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">المدة (دقيقة)</label>
              <input type="number" value={form.duration_minutes} onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">ترتيب العرض</label>
              <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-gray-50">إلغاء</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light">{editing ? "حفظ" : "إضافة"}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
