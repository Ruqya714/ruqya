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
  tiktok: "TikTok URL",
  x_twitter: "X (Twitter) URL",
  snapchat: "Snapchat URL",
  infographic_image_url: "رابط صورة البرنامج العلاجي (الإنفوجرافيك)",
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
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
            ) : key === "infographic_image_url" ? (
              <div className="space-y-4">
                <input
                  type="file"
                  accept="image/*"
                  disabled={isUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploading(true);
                    
                    const fileExt = file.name.split('.').pop();
                    const fileName = `infographic-${Date.now()}.${fileExt}`;
                    const { data, error } = await supabase.storage.from("public_images").upload(fileName, file);
                    
                    if (error) {
                      toast("حدث خطأ في رفع الصورة", "error");
                    } else if (data) {
                      const { data: publicData } = supabase.storage.from("public_images").getPublicUrl(data.path);
                      setValues({ ...values, [key]: publicData.publicUrl });
                      toast("تم رفع الصورة بنجاح", "success");
                    }
                    setIsUploading(false);
                  }}
                  className="block w-full text-sm text-text-secondary file:me-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-all border border-border rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                />
                {(values[key] || isUploading) && (
                  <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-border">
                    {isUploading ? (
                      <div className="flex items-center gap-3 text-sm text-primary">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                        جاري رفع الصورة...
                      </div>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-text-primary mb-3">الصورة الحالية المرتبطة بالموقع:</p>
                        <div className="relative inline-block border border-border rounded-lg overflow-hidden shadow-sm bg-white p-2">
                          <img src={values[key]} alt="Infographic" className="h-32 object-contain" />
                        </div>
                        <div className="mt-4">
                          <label className="block text-xs text-text-secondary mb-1">أو يمكنك تعديل الرابط يدوياً (اختياري)</label>
                          <input
                            value={values[key] || ""}
                            onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                            dir="ltr"
                            placeholder="https://..."
                          />
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <input
                value={values[key] || ""}
                onChange={(e) => setValues({ ...values, [key]: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                dir={["phone", "whatsapp", "email", "instagram", "youtube", "facebook", "tiktok", "x_twitter", "snapchat"].includes(key) ? "ltr" : "rtl"}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
