"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Modal } from "@/components/ui";
import { useToast } from "@/components/ui/Toast";
import {
  fetchServicesI18nAction,
  saveServiceWithI18nAction,
} from "@/app/actions/cms";
import {
  Plus,
  Pencil,
  Trash2,
  Calendar,
  CheckCircle2,
  XCircle,
  Eye,
  EyeOff,
  Clock,
  DollarSign,
  Briefcase,
  AlertCircle,
  Globe,
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  description: string;
  name_tr?: string;
  description_tr?: string;
  icon: string | null;
  duration_minutes: number;
  display_order: number;
  price: number | null;
  min_days_delay: number | null;
  max_days_limit: number | null;
  is_active: boolean;
  created_at?: string;
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: "",
    description: "",
    name_tr: "",
    description_tr: "",
    price: "",
    min_days_delay: "1",
    max_days_limit: "",
    duration_minutes: "60",
    display_order: "1",
    is_active: true,
  });

  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const res = await fetchServicesI18nAction();
    if (res.success && res.data) {
      setServices(res.data as Service[]);
    } else {
      toast("فشل في تحميل باقات الاستشارات", "error");
    }
    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    load();
  }, [load]);

  const openNew = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      name_tr: "",
      description_tr: "",
      price: "",
      min_days_delay: "1",
      max_days_limit: "",
      duration_minutes: "60",
      display_order: String(services.length + 1),
      is_active: true,
    });
    setShowModal(true);
  };

  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({
      name: s.name || "",
      description: s.description || "",
      name_tr: s.name_tr || "",
      description_tr: s.description_tr || "",
      price: s.price !== null ? String(s.price) : "",
      min_days_delay: s.min_days_delay !== null ? String(s.min_days_delay) : "1",
      max_days_limit: s.max_days_limit !== null ? String(s.max_days_limit) : "",
      duration_minutes: String(s.duration_minutes || 60),
      display_order: String(s.display_order || 1),
      is_active: s.is_active !== false,
    });
    setShowModal(true);
  };

  const handleToggleActive = async (s: Service) => {
    const updatedStatus = !s.is_active;
    const { error } = await supabase
      .from("services")
      .update({ is_active: updatedStatus })
      .eq("id", s.id);

    if (error) {
      toast("حدث خطأ أثناء تغيير الحالة", "error");
    } else {
      toast(
        updatedStatus ? "تم تفعيل الاستشارة وظهورها في صفحة الحجز" : "تم إخفاء الاستشارة من صفحة الحجز",
        "success"
      );
      setServices((prev) =>
        prev.map((item) => (item.id === s.id ? { ...item, is_active: updatedStatus } : item))
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await saveServiceWithI18nAction({
        id: editing?.id,
        name: form.name.trim(),
        description: form.description.trim(),
        name_tr: form.name_tr.trim(),
        description_tr: form.description_tr.trim(),
        price: form.price ? parseFloat(form.price) : 0,
        min_days_delay: form.min_days_delay ? parseInt(form.min_days_delay) : 0,
        max_days_limit: form.max_days_limit ? parseInt(form.max_days_limit) : null,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : 60,
        display_order: form.display_order ? parseInt(form.display_order) : 1,
        is_active: form.is_active,
      });

      if (!res.success) throw new Error(res.error);

      toast(editing ? "تم تعديل باقة الاستشارة بنجاح" : "تمت إضافة باقة استشارة جديدة بنجاح", "success");
      setShowModal(false);
      load();
    } catch (err: any) {
      toast(err.message || "حدث خطأ أثناء الحفظ", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذه الاستشارة نهائياً؟")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) {
      toast("حدث خطأ أثناء الحذف", "error");
    } else {
      toast("تم حذف باقة الاستشارة", "success");
      load();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
            <Briefcase size={15} />
            <span>باقات الاستشارات والحجوزات</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            إدارة أنواع الاستشارات والأسعار
          </h1>
          <p className="text-text-secondary text-sm mt-1.5 leading-relaxed max-w-2xl">
            أضف وعدّل باقات الاستشارات الصوتية المتاحة للعملاء، الأسعار، شروط الإتاحة الزمنية للمواعيد، والترجمة التركية.
          </p>
        </div>

        <button
          onClick={openNew}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-bold hover:bg-primary-light transition-all shadow-sm flex-shrink-0"
        >
          <Plus size={16} />
          إضافة باقة جديدة
        </button>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-border shadow-sm">
            <div className="w-8 h-8 border-3 border-primary/25 border-t-primary rounded-full animate-spin mx-auto mb-3" />
            <p className="text-text-secondary text-sm font-medium">جاري تحميل باقات الاستشارات...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="py-16 text-center bg-white rounded-3xl border border-border shadow-sm text-text-secondary">
            لا توجد باقات استشارات مضافة حالياً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {services.map((s) => {
              return (
                <div
                  key={s.id}
                  className={`bg-white rounded-3xl border transition-all p-6 shadow-sm flex flex-col justify-between gap-5 ${
                    s.is_active ? "border-border hover:border-primary/40" : "border-gray-200 opacity-60 bg-gray-50/50"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-bold text-text-primary text-base sm:text-lg">
                            {s.name}
                          </h3>
                          {s.is_active ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full border border-green-200">
                              <CheckCircle2 size={12} /> مفعلة
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                              <XCircle size={12} /> مخفية
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                          {s.description || "لا يوجد وصف مدخل"}
                        </p>
                      </div>

                      <div className="text-start sm:text-end flex-shrink-0 bg-primary/5 px-3 py-1.5 rounded-xl border border-primary/10">
                        <span className="text-xs font-semibold text-text-secondary block">السعر</span>
                        <span className="text-lg font-bold text-primary">
                          ${s.price !== null ? s.price : 0}
                        </span>
                      </div>
                    </div>

                    {/* Turkish Translation Preview */}
                    {s.name_tr && (
                      <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-800 font-bold text-[11px]">
                          <Globe size={12} />
                          <span>الترجمة التركية (Türkçe):</span>
                        </div>
                        <p className="font-semibold text-text-primary">{s.name_tr}</p>
                        {s.description_tr && <p className="text-text-secondary text-[11px]">{s.description_tr}</p>}
                      </div>
                    )}

                    {/* Details badges */}
                    <div className="flex items-center gap-2 pt-1 flex-wrap text-xs text-text-secondary">
                      <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-border">
                        <Clock size={12} className="text-text-muted" />
                        المدة: {s.duration_minutes || 60} دقيقة
                      </span>
                      <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-border">
                        <Calendar size={12} className="text-text-muted" />
                        أول موعد: بعد {s.min_days_delay || 0} يوم
                      </span>
                      {s.max_days_limit && (
                        <span className="inline-flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-border">
                          أقصى حد: {s.max_days_limit} يوم
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bottom Bar */}
                  <div className="flex items-center justify-between gap-2 pt-4 border-t border-border">
                    <button
                      onClick={() => handleToggleActive(s)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        s.is_active
                          ? "bg-amber-50 text-amber-700 hover:bg-amber-100"
                          : "bg-green-50 text-green-700 hover:bg-green-100"
                      }`}
                    >
                      {s.is_active ? <EyeOff size={13} /> : <Eye size={13} />}
                      {s.is_active ? "إخفاء" : "تفعيل"}
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => openEdit(s)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-text-primary text-xs font-bold transition-colors"
                      >
                        <Pencil size={13} />
                        تعديل
                      </button>
                      <button
                        onClick={() => deleteService(s.id)}
                        className="p-1.5 rounded-xl bg-gray-50 hover:bg-red-50 text-text-muted hover:text-red-600 transition-colors"
                        title="حذف"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal: Add / Edit Service (Dual Language) */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? `تعديل استشارة: ${editing.name}` : "إضافة باقة استشارة جديدة (عربي وتركي)"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto px-1">
          {/* Arabic Section */}
          <div className="p-4 bg-gray-50 rounded-2xl border border-border space-y-3">
            <span className="text-xs font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-md inline-block">النسخة العربية (الأساسية)</span>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                اسم نوع الاستشارة بالعربية *
              </label>
              <input
                required
                placeholder="مثال: استشارة مستعجلة، أو استشارة عادية"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                الوصف المعروض في صفحة الحجز بالعربية
              </label>
              <textarea
                rows={2}
                placeholder="مثال: تتيح لك حجز موعد خلال 24 ساعة، أو تظهر تواريخ من 7 أيام وما بعد"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white resize-y"
              />
            </div>
          </div>

          {/* Turkish Section */}
          <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
            <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md inline-block">الترجمة باللغة التركية (Türkçe - اختياري)</span>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Hizmet Adı (اسم الباقة بالتركي)
              </label>
              <input
                placeholder="Örnek: Acil Sesli Danışmanlık veya Normal Sesli Danışmanlık"
                value={form.name_tr}
                onChange={(e) => setForm({ ...form, name_tr: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1">
                Açıklama (الوصف بالتركي)
              </label>
              <textarea
                rows={2}
                placeholder="Örnek: 24 saat içinde randevu alma imkânı sağlar"
                value={form.description_tr}
                onChange={(e) => setForm({ ...form, description_tr: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl border border-border text-sm bg-white resize-y"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                السعر بالدولار ($ USD) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                placeholder="100"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                المدة التقريبية (دقيقة)
              </label>
              <input
                type="number"
                min="15"
                step="5"
                placeholder="60"
                value={form.duration_minutes}
                onChange={(e) => setForm({ ...form, duration_minutes: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-border text-sm"
                dir="ltr"
              />
            </div>
          </div>

          {/* Date Availability Settings */}
          <div className="p-4 bg-primary/5 rounded-2xl border border-primary/15 space-y-3">
            <h4 className="text-xs font-bold text-primary flex items-center gap-1.5">
              <Calendar size={15} />
              إعدادات إتاحة تواريخ المواعيد للعميل (Slot Availability Range)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  أول موعد متاح بعد كم يوم؟ *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  placeholder="1 (بعد 24 ساعة) أو 7"
                  value={form.min_days_delay}
                  onChange={(e) => setForm({ ...form, min_days_delay: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-border text-sm bg-white"
                  dir="ltr"
                />
                <p className="text-[11px] text-text-muted mt-1">
                  1 = تبدأ بعد 24 ساعة (مستعجل)، 7 = تبدأ بعد أسبوع (عادي)
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  أقصى حد لظهور المواعيد (أيام - اختياري)
                </label>
                <input
                  type="number"
                  min="1"
                  placeholder="7 (أو اتركه فارغاً)"
                  value={form.max_days_limit}
                  onChange={(e) => setForm({ ...form, max_days_limit: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg border border-border text-sm bg-white"
                  dir="ltr"
                />
                <p className="text-[11px] text-text-muted mt-1">
                  مثال: 7 للمستعجل (ليظهر فقط من يوم 1 إلى يوم 7)
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center pt-2">
            <div>
              <label className="block text-xs font-bold text-text-primary mb-1.5">
                ترتيب العرض
              </label>
              <input
                type="number"
                min="1"
                value={form.display_order}
                onChange={(e) => setForm({ ...form, display_order: e.target.value })}
                className="w-full px-4 py-2 rounded-xl border border-border text-sm"
                dir="ltr"
              />
            </div>

            <div className="pt-4">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
                />
                <span className="text-sm font-semibold text-text-primary">
                  مفعلة وتظهر في صفحة الحجز
                </span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border mt-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-light transition-all disabled:opacity-50 shadow-sm"
            >
              {isSaving ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : null}
              {editing ? "حفظ التعديلات" : "إضافة الباقة"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
