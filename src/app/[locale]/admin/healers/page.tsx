/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, EmptyState } from "@/components/ui";
import { fetchHealersI18nAction, saveHealerWithI18nAction } from "@/app/actions/cms";
import { Plus, Pencil, Trash2, Image as ImageIcon, Globe } from "lucide-react";

interface Healer {
  id: string;
  profile_id: string;
  display_name: string;
  title: string;
  photo_url: string | null;
  specialization: string | null;
  experience_years: number | null;
  is_visible: boolean;
  display_name_tr?: string;
  title_tr?: string;
  specialization_tr?: string;
  profiles: { full_name: string } | null;
}

export default function AdminHealersPage() {
  const [healers, setHealers] = useState<Healer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingHealer, setEditingHealer] = useState<Healer | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    display_name: "",
    title: "",
    specialization: "",
    display_name_tr: "",
    title_tr: "",
    specialization_tr: "",
    experience_years: "",
    photo_url: "",
  });

  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchHealersI18nAction();
    if (res.success && res.data) {
      setHealers(res.data as Healer[]);
    } else {
      alert("خطأ في جلب البيانات: " + (res.error || ""));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditingHealer(null);
    setForm({
      email: "",
      password: "",
      display_name: "",
      title: "",
      specialization: "",
      display_name_tr: "",
      title_tr: "",
      specialization_tr: "",
      experience_years: "",
      photo_url: "",
    });
    setShowModal(true);
  };

  const openEdit = (h: Healer) => {
    setEditingHealer(h);
    setForm({
      email: "",
      password: "", // We don't load the password
      display_name: h.display_name || "",
      title: h.title || "",
      specialization: h.specialization || "",
      display_name_tr: h.display_name_tr || "",
      title_tr: h.title_tr || "",
      specialization_tr: h.specialization_tr || "",
      experience_years: h.experience_years ? h.experience_years.toString() : "",
      photo_url: h.photo_url || "",
    });
    setShowModal(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `healers/${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;

      const { error } = await supabase.storage.from("public_images").upload(fileName, file);

      if (error) {
        console.error("Error uploading image:", error);
        alert("حدث خطأ أثناء رفع الصورة. يُرجى التثبت من إعدادات Storage.");
        return;
      }

      const { data: { publicUrl } } = supabase.storage.from("public_images").getPublicUrl(fileName);
      setForm({ ...form, photo_url: publicUrl });
    } catch (err) {
      console.error(err);
      alert("حدث خطأ غير متوقع");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingHealer) {
        const res = await saveHealerWithI18nAction({
          id: editingHealer.id,
          display_name: form.display_name,
          title: form.title,
          specialization: form.specialization,
          display_name_tr: form.display_name_tr,
          title_tr: form.title_tr,
          specialization_tr: form.specialization_tr,
          experience_years: form.experience_years ? parseInt(form.experience_years) : null,
          photo_url: form.photo_url || undefined,
        });

        if (!res.success) throw new Error(res.error);
        
        if (editingHealer.profile_id) {
          await supabase.from("profiles").update({ full_name: form.display_name }).eq("id", editingHealer.profile_id);
        }
      } else {
        // Create healer via server-side API
        const res = await fetch("/api/admin/healers", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            display_name: form.display_name,
            title: form.title,
            specialization: form.specialization,
            experience_years: form.experience_years,
            photo_url: form.photo_url,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          alert(result.error || "حدث خطأ أثناء إنشاء المعالج");
          return;
        }

        if (result.healer?.id && (form.display_name_tr || form.title_tr || form.specialization_tr)) {
          await saveHealerWithI18nAction({
            id: result.healer.id,
            display_name: form.display_name,
            title: form.title,
            specialization: form.specialization,
            display_name_tr: form.display_name_tr,
            title_tr: form.title_tr,
            specialization_tr: form.specialization_tr,
            experience_years: form.experience_years ? parseInt(form.experience_years) : null,
            photo_url: form.photo_url || undefined,
          });
        }
      }
      setShowModal(false);
      load();
    } catch (err: any) {
      alert(err.message || "حدث خطأ أثناء حفظ المعالج");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from("healers").update({ is_visible: !current }).eq("id", id);
    load();
  };

  const deleteHealer = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المعالج؟ سيتم حذف بياناته من النظام.")) return;
    await supabase.from("healers").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">إدارة المعالجين وفريق العمل</h1>
          <p className="text-text-secondary text-sm mt-1.5">{healers.length} معالج مسجل في النظام مع دعم الترجمة التركية</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all shadow-sm"
        >
          <Plus size={16} /> إضافة معالج جديد
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl border border-border">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-text-secondary text-sm font-medium">جاري تحميل المعالجين...</p>
          </div>
        ) : healers.length === 0 ? (
          <div className="col-span-full">
            <EmptyState title="لا يوجد معالجون حالياً" description="انقر على إضافة معالج للبدء في بناء فريقك" />
          </div>
        ) : (
          healers.map((h) => (
            <div key={h.id} className="bg-white rounded-3xl border border-border p-6 hover:shadow-lg transition-all flex flex-col justify-between gap-4">
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                    {h.photo_url ? (
                       <img src={h.photo_url} alt={h.display_name} className="w-full h-full object-cover" />
                    ) : (
                       <span className="text-primary font-bold text-xl">{h.display_name?.charAt(0) || "م"}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between">
                      <p className="font-bold text-text-primary text-base truncate">{h.display_name}</p>
                      <span
                        className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${h.is_visible ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`}
                        title={h.is_visible ? "مرئي" : "مخفي"}
                      />
                    </div>
                    <p className="text-xs text-primary font-bold truncate mt-0.5">{h.title}</p>
                    <p className="text-[11px] text-text-muted mt-1 truncate">{h.profiles?.full_name || "حساب معالج"}</p>
                  </div>
                </div>

                {/* Turkish Translation preview */}
                {h.display_name_tr && (
                  <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs mb-3 space-y-0.5">
                    <div className="flex items-center gap-1 text-amber-800 font-bold text-[10px]">
                      <Globe size={11} />
                      <span>Türkçe:</span>
                    </div>
                    <p className="font-semibold text-text-primary">{h.display_name_tr}</p>
                    {h.title_tr && <p className="text-text-muted text-[11px]">{h.title_tr}</p>}
                  </div>
                )}

                <div className="space-y-1.5 text-xs">
                  {h.specialization && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">التخصص:</span>
                      <span className="font-medium text-text-secondary">{h.specialization}</span>
                    </div>
                  )}
                  {h.experience_years && (
                    <div className="flex items-center justify-between">
                      <span className="text-text-muted">الخبرة:</span>
                      <span className="font-medium text-text-secondary">{h.experience_years} سنوات</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-4 mt-auto">
                <button
                  onClick={() => toggleVisibility(h.id, h.is_visible)}
                  className={`flex-1 text-xs py-2 rounded-xl border font-bold transition-colors ${
                    h.is_visible
                      ? "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50"
                      : "border-border text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  {h.is_visible ? "إخفاء عن الموقع" : "إظهار للمستخدمين"}
                </button>
                <button
                  onClick={() => openEdit(h)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-text-secondary hover:text-primary transition-colors"
                  title="تعديل"
                >
                  <Pencil size={15} />
                </button>
                <button
                  onClick={() => deleteHealer(h.id)}
                  className="p-2 rounded-xl bg-gray-50 hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors"
                  title="حذف"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingHealer ? `تعديل المعالج: ${editingHealer.display_name}` : "إضافة معالج جديد (عربي وتركي)"}>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
           <div className="flex items-center gap-5 pb-4 border-b border-border">
              <div className="w-20 h-20 rounded-2xl bg-gray-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
                {form.photo_url ? (
                  <img src={form.photo_url} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon size={24} className="text-text-muted" />
                )}
                <label className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-10 text-xs font-medium">
                  {isUploading ? "جاري الرفع..." : "تغيير الصورة"}
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploading} />
                </label>
              </div>
              <div className="flex-1">
                 <p className="text-xs font-bold text-text-primary mb-1">صورة المعالج</p>
                 <p className="text-xs text-text-muted leading-relaxed">ارفع صورة واضحة ومناسبة تظهر في صفحة الحجز، يفضل أن تكون مربعة.</p>
              </div>
           </div>

          {!editingHealer && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">البريد الإلكتروني للولوج *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm" dir="ltr" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">كلمة المرور الابتدائية *</label>
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm" dir="ltr" />
              </div>
            </div>
          )}

          {/* Arabic Section */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-border space-y-3">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md inline-block">البيانات بالعربية (الأساسية)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">الاسم المعروض بالعربية *</label>
                <input required value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white font-bold" placeholder="مثال: الراقي سيف الله أبو عامر" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">المسمى الوظيفي بالعربية *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white" placeholder="مثال: مستشار ومعالج والمدير التنفيذي" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-text-primary mb-1">التخصص بالعربية</label>
                <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white" placeholder="رقية شرعية، استخراج عقد، استشارات" />
              </div>
            </div>
          </div>

          {/* Turkish Section */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md inline-block">الترجمة باللغة التركية (Türkçe - اختياري)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Görünen Ad (الاسم بالتركي)</label>
                <input value={form.display_name_tr} onChange={(e) => setForm({ ...form, display_name_tr: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white font-medium" placeholder="Örnek: Rukye Uzmanı Seyfullah Ebu Amir" />
              </div>
              <div>
                <label className="block text-xs font-bold text-text-primary mb-1">Ünvan (المسمى الوظيفي بالتركي)</label>
                <input value={form.title_tr} onChange={(e) => setForm({ ...form, title_tr: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white" placeholder="Örnek: Danışman Terapist ve Genel Müdür" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-text-primary mb-1">Uzmanlık Alanı (التخصص بالتركي)</label>
                <input value={form.specialization_tr} onChange={(e) => setForm({ ...form, specialization_tr: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white" placeholder="Şer'i Rukye, Düğüm Çözme" />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-text-primary mb-1">سنوات الخبرة</label>
            <input type="number" min="0" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} className="w-full px-3.5 py-2 rounded-xl border border-border text-sm" placeholder="مثال: 25" dir="ltr" />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-3">
            <button type="button" onClick={() => setShowModal(false)} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 transition-colors disabled:opacity-50">إلغاء</button>
            <button type="submit" disabled={isUploading || isSubmitting} className="px-7 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all disabled:opacity-50 shadow-sm">
              {isSubmitting ? "جاري الحفظ..." : editingHealer ? "حفظ التعديلات" : "إضافة المعالج"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
