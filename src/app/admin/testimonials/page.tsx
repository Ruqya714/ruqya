"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui";
import { Plus, Pencil, Trash2, Star } from "lucide-react";

interface Testimonial {
  id: string;
  patient_name: string;
  content: string;
  rating: number;
  is_approved: boolean;
}

export default function AdminTestimonialsPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({ patient_name: "", content: "", rating: "5" });
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm({ patient_name: "", content: "", rating: "5" }); setShowModal(true); };
  const openEdit = (t: Testimonial) => { setEditing(t); setForm({ patient_name: t.patient_name, content: t.content, rating: String(t.rating) }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { patient_name: form.patient_name, content: form.content, rating: parseInt(form.rating), is_approved: true };
    if (editing) { await supabase.from("testimonials").update(data).eq("id", editing.id); }
    else { await supabase.from("testimonials").insert(data); }
    setShowModal(false); load();
  };

  const toggleApproval = async (id: string, current: boolean) => {
    await supabase.from("testimonials").update({ is_approved: !current }).eq("id", id); load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await supabase.from("testimonials").delete().eq("id", id); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">شهادات المرضى</h1>
          <p className="text-text-secondary text-sm mt-1">{items.length} شهادة</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all">
          <Plus size={16} /> إضافة شهادة
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isLoading ? (
          <div className="col-span-full py-12 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : items.length === 0 ? (
          <div className="col-span-full py-12 text-center text-text-secondary">لا توجد شهادات</div>
        ) : (
          items.map((t) => (
            <div key={t.id} className={`bg-white rounded-xl border p-5 transition-shadow hover:shadow-md ${t.is_approved ? "border-border" : "border-amber-200 bg-amber-50/30"}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-text-primary">{t.patient_name}</p>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star key={i} size={14} className={i < t.rating ? "text-accent fill-accent" : "text-gray-200"} />
                    ))}
                  </div>
                </div>
                {!t.is_approved && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">بانتظار الموافقة</span>}
              </div>
              <p className="text-sm text-text-secondary line-clamp-3 mb-4">{t.content}</p>
              <div className="flex items-center gap-2 border-t border-border pt-3">
                <button onClick={() => toggleApproval(t.id, t.is_approved)} className={`flex-1 text-xs py-1.5 rounded-lg border transition-colors ${t.is_approved ? "border-green-200 text-green-700" : "border-border text-text-secondary hover:border-green-200 hover:text-green-700"}`}>
                  {t.is_approved ? "معتمد ✓" : "اعتماد"}
                </button>
                <button onClick={() => openEdit(t)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary"><Pencil size={14} /></button>
                <button onClick={() => deleteItem(t.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600"><Trash2 size={14} /></button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "تعديل الشهادة" : "إضافة شهادة"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">اسم المريض *</label>
            <input required value={form.patient_name} onChange={(e) => setForm({ ...form, patient_name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">المحتوى *</label>
            <textarea required rows={4} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">التقييم</label>
            <select value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20">
              {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} نجوم</option>)}
            </select>
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
