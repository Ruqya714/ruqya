/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  display_order: number;
}

export default function AdminFAQsPage() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<FAQ | null>(null);
  const [form, setForm] = useState({ question: "", answer: "", display_order: "1" });
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("faqs").select("*").order("display_order");
    setFaqs(data || []);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const openNew = () => { setEditing(null); setForm({ question: "", answer: "", display_order: String(faqs.length + 1) }); setShowModal(true); };
  const openEdit = (f: FAQ) => { setEditing(f); setForm({ question: f.question, answer: f.answer, display_order: String(f.display_order) }); setShowModal(true); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = { question: form.question, answer: form.answer, display_order: parseInt(form.display_order) };
    if (editing) { await supabase.from("faqs").update(data).eq("id", editing.id); }
    else { await supabase.from("faqs").insert(data); }
    setShowModal(false); load();
  };

  const deleteItem = async (id: string) => {
    if (!confirm("هل أنت متأكد من الحذف؟")) return;
    await supabase.from("faqs").delete().eq("id", id); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة الأسئلة الشائعة</h1>
          <p className="text-text-secondary text-sm mt-1">{faqs.length} سؤال</p>
        </div>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all">
          <Plus size={16} /> سؤال جديد
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        {isLoading ? (
          <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>
        ) : faqs.length === 0 ? (
          <div className="py-12 text-center text-text-secondary">لا توجد أسئلة شائعة</div>
        ) : (
          <div className="divide-y divide-border">
            {faqs.map((f) => (
              <div key={f.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                <GripVertical size={16} className="text-text-muted flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-text-primary">{f.question}</p>
                  <p className="text-sm text-text-secondary mt-1 line-clamp-2">{f.answer}</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(f)} className="p-1.5 rounded-lg hover:bg-gray-100 text-text-secondary"><Pencil size={14} /></button>
                  <button onClick={() => deleteItem(f.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-text-secondary hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editing ? "تعديل السؤال" : "سؤال جديد"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">السؤال *</label>
            <input required value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">الإجابة *</label>
            <textarea required rows={4} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">ترتيب العرض</label>
            <input type="number" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
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
