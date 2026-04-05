"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/Toast";
import { Save, User } from "lucide-react";
import { useTranslations } from "next-intl";

export default function HealerProfilePage() {
  const t = useTranslations("Healer");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({ full_name: "", specialization: "", bio: "", is_available: true });
  const [healerId, setHealerId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const supabase = createClient();

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
    const { data: healer } = await supabase.from("healers").select("*").eq("profile_id", user.id).single();

    if (healer) {
      setHealerId(healer.id);
      setForm({
        full_name: profile?.full_name || "",
        specialization: healer.specialization || "",
        bio: healer.bio || "",
        is_available: healer.is_available,
      });
    }
    setIsLoading(false);
  }, [supabase]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!healerId || !userId) return;
    setIsSaving(true);
    try {
      await supabase.from("profiles").update({ full_name: form.full_name }).eq("id", userId);
      await supabase.from("healers").update({ specialization: form.specialization, bio: form.bio, is_available: form.is_available }).eq("id", healerId);
      toast(t("savedSuccess"), "success");
    } catch {
      toast(t("savedError"), "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-primary">{t("profile")}</h1>
        <button onClick={handleSave} disabled={isSaving} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-all">
          {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
          {t("saveChanges")}
        </button>
      </div>

      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-border p-6 space-y-5">
          {/* Avatar */}
          <div className="flex items-center gap-4 pb-5 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <User size={28} className="text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg text-text-primary">{form.full_name || t("healer")}</p>
              <p className="text-sm text-text-secondary">{form.specialization || t("notSpecified")}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("fullName")}</label>
            <input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("specialization")}</label>
            <input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={t("specPlaceholder")} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">{t("aboutMe")}</label>
            <textarea rows={4} value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" placeholder={t("aboutPlaceholder")} />
          </div>

          <div className="flex items-center gap-3 pt-3 border-t border-border">
            <input type="checkbox" id="available" checked={form.is_available} onChange={(e) => setForm({ ...form, is_available: e.target.checked })} className="accent-primary" />
            <label htmlFor="available" className="text-sm font-medium">{t("available")}</label>
          </div>
        </div>
      </div>
    </div>
  );
}
