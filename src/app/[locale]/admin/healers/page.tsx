/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal, EmptyState } from "@/components/ui";
import { Plus, Pencil, Trash2, Image as ImageIcon } from "lucide-react";

interface Healer {
  id: string;
  profile_id: string;
  display_name: string;
  title: string;
  photo_url: string | null;
  specialization: string | null;
  experience_years: number | null;
  is_visible: boolean;
  profiles: { full_name: string } | null;
}

export default function AdminHealersPage() {
  const [healers, setHealers] = useState<Healer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingHealer, setEditingHealer] = useState<Healer | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    display_name: "",
    title: "",
    specialization: "",
    experience_years: "",
    photo_url: "",
  });

  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("healers")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Supabase Error fetching healers:", error);
      alert("خطأ في جلب البيانات: " + error.message);
    }
    
    setHealers((data as unknown as Healer[]) || []);
    setIsLoading(false);
  }, [supabase]);

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
    
    const payload = {
      display_name: form.display_name,
      title: form.title,
      specialization: form.specialization || null,
      experience_years: form.experience_years ? parseInt(form.experience_years) : null,
      photo_url: form.photo_url || null,
    };

    if (editingHealer) {
      await supabase.from("healers").update(payload).eq("id", editingHealer.id);
      
      // Update full_name in profile if needed
      if (editingHealer.profile_id) {
         await supabase.from("profiles").update({ full_name: form.display_name }).eq("id", editingHealer.profile_id);
      }
    } else {
      // Create user via Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.display_name } },
      });

      if (authError || !authData.user) {
        alert("خطأ في إنشاء الحساب (إذا كنت مسؤولاً، يرجى إنشاء حساب المعالج أولاً أو تغيير إعدادات Auth في Supabase): " + (authError?.message || ""));
        return;
      }
      
      // Ensure the profile has the healer role
      await supabase.from("profiles").update({ role: "healer", full_name: form.display_name }).eq("id", authData.user.id);
      
      // Create healer record
      await supabase.from("healers").insert({
        ...payload,
        profile_id: authData.user.id,
      });
    }
    setShowModal(false);
    load();
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    await supabase.from("healers").update({ is_visible: !current }).eq("id", id);
    load();
  };

  const deleteHealer = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا المعالج؟ سيتم حذف بياناته من النظام.")) return;
    await supabase.from("healers").delete().eq("id", id);
    // Optionally alert the admin they might want to delete the user from Auth manually if required.
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إدارة المعالجين</h1>
          <p className="text-text-secondary text-sm mt-1">{healers.length} معالج متاح</p>
        </div>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all shadow-md focus:ring-4 focus:ring-primary/20"
        >
          <Plus size={16} /> إضافة معالج
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-16">
            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="mt-4 text-text-secondary text-sm">جاري تحميل المعالجين...</p>
          </div>
        ) : healers.length === 0 ? (
          <div className="col-span-full">
            <EmptyState title="لا يوجد معالجون حالياً" description="انقر على إضافة معالج للبدء في بناء فريقك" />
          </div>
        ) : (
          healers.map((h) => (
            <div key={h.id} className="bg-white rounded-2xl border border-border p-5 hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center flex-shrink-0">
                  {h.photo_url ? (
                     <img src={h.photo_url} alt={h.display_name} className="w-full h-full object-cover" />
                  ) : (
                     <span className="text-primary font-bold text-xl">{h.display_name?.charAt(0) || "م"}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <div className="flex items-start justify-between">
                    <p className="font-bold text-text-primary truncate">{h.display_name}</p>
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${h.is_visible ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-300"}`}
                      title={h.is_visible ? "مرئي" : "مخفي"}
                    />
                  </div>
                  <p className="text-sm text-primary font-medium truncate">{h.title}</p>
                  <p className="text-xs text-text-muted mt-1 truncate">{h.profiles?.full_name || "بدون اسم"}</p>
                </div>
              </div>

              <div className="space-y-2 mb-6 flex-1">
                {h.specialization && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">التخصص:</span>
                    <span className="font-medium text-text-secondary">{h.specialization}</span>
                  </div>
                )}
                {h.experience_years && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">الخبرة:</span>
                    <span className="font-medium text-text-secondary">{h.experience_years} سنوات</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 border-t border-border pt-4 mt-auto">
                <button
                  onClick={() => toggleVisibility(h.id, h.is_visible)}
                  className={`flex-1 text-xs py-2 rounded-lg border font-medium transition-colors ${
                    h.is_visible
                      ? "border-green-200 text-green-700 hover:bg-green-50"
                      : "border-border text-text-secondary hover:bg-gray-50"
                  }`}
                >
                  {h.is_visible ? "إخفاء عن الموقع" : "إظهار للمستخدمين"}
                </button>
                <button
                  onClick={() => openEdit(h)}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-primary/10 text-text-secondary hover:text-primary transition-colors focus:ring-2 focus:ring-primary/20"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => deleteHealer(h.id)}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-red-50 text-text-secondary hover:text-red-600 transition-colors focus:ring-2 focus:ring-red-500/20"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingHealer ? "تعديل المعالج" : "إضافة معالج جديد"}>
        <form onSubmit={handleSubmit} className="space-y-5">
           
           <div className="flex items-center gap-5 pb-5 border-b border-border">
              <div className="w-20 h-20 rounded-full bg-gray-100 border border-border overflow-hidden flex items-center justify-center flex-shrink-0 relative group">
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
                 <p className="text-sm font-semibold text-text-primary mb-1">صورة المعالج</p>
                 <p className="text-xs text-text-muted leading-relaxed">ارفع صورة واضحة ومناسبة تظهر في صفحة الحجز، يفضل أن تكون مربعة. (سيتم الرفع مباشرةً)</p>
              </div>
           </div>

          {!editingHealer && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">البريد الإلكتروني للولوج *</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">كلمة المرور الابتدائية *</label>
                <input required type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" dir="ltr" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">الاسم المعروض للمراجعين *</label>
              <input required value={form.display_name} onChange={(e) => setForm({ ...form, display_name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: الشيخ سالم عمر" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">المسمى الوظيفي *</label>
              <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: رئيس القسم ومعالج رقوي" />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">التخصص التفصيلي</label>
              <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="رقية شرعية، استشارات" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">سنوات الخبرة</label>
              <input type="number" min="0" value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder="مثال: 10" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3 pt-6 border-t border-border mt-6">
            <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-lg border border-border text-sm font-medium text-text-secondary hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors">إلغاء</button>
            <button type="submit" disabled={isUploading} className="px-7 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light focus:outline-none focus:ring-4 focus:ring-primary/20 transition-all disabled:opacity-50">
              {editingHealer ? "حفظ التعديلات" : "إضافة وحفظ"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
