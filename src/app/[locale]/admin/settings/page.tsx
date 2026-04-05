"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { Save } from "lucide-react";

interface Setting {
  id: string;
  key: string;
  value: string;
}

const SETTING_LABELS: Record<string, string> = {
  phone: "رقم الهاتف",
  whatsapp: "واتساب",
  email: "البريد الإلكتروني",
  address: "العنوان",
  about_text: "نص من نحن",
  instagram: "Instagram URL",
  youtube: "YouTube URL",
  facebook: "Facebook URL",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const supabase = createClient();

  const load = useCallback(async () => {
    setIsLoading(true);
    const { data } = await supabase.from("site_settings").select("*");
    setSettings(data || []);
    const vals: Record<string, string> = {};
    data?.forEach((s) => { vals[s.key] = s.value; });
    setValues(vals);
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      for (const [key, value] of Object.entries(values)) {
        const existing = settings.find((s) => s.key === key);
        if (existing) {
          await supabase.from("site_settings").update({ value }).eq("id", existing.id);
        } else {
          await supabase.from("site_settings").insert({ key, value });
        }
      }
      toast("تم حفظ الإعدادات بنجاح", "success");
      load();
    } catch {
      toast("حدث خطأ أثناء الحفظ", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>;
  }

  const allKeys = Object.keys(SETTING_LABELS);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">إعدادات الموقع</h1>
          <p className="text-text-secondary text-sm mt-1">إدارة بيانات التواصل ومعلومات الموقع</p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-all"
        >
          {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          حفظ التغييرات
        </button>
      </div>

      <div className="bg-white rounded-xl border border-border p-6 space-y-5">
        {allKeys.map((key) => (
          <div key={key}>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {SETTING_LABELS[key]}
            </label>
            {key === "about_text" ? (
              <textarea
                rows={3}
                value={values[key] || ""}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            ) : (
              <input
                value={values[key] || ""}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                dir={["phone", "whatsapp", "email", "instagram", "youtube", "facebook"].includes(key) ? "ltr" : "rtl"}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
