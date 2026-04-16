"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { submitContactMessage } from "@/app/actions/contact";

export default function ContactForm() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await submitContactMessage(form);
      if (!response.success) {
        setError(t("error") || "An error occurred");
        return;
      }
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError(t("error") || "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-border p-6 lg:p-8">
      <h2 className="text-xl font-bold text-text-primary mb-6">{t("formTitle")}</h2>

      {sent ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-4">
            <Send size={28} className="text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-2">{t("successTitle")}</h3>
          <p className="text-sm text-text-secondary">{t("successDesc")}</p>
          <button onClick={() => setSent(false)} className="mt-6 text-sm text-primary hover:text-primary-light transition-colors">
            {t("sendAnother")}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t("fullName")} <span className="text-error">*</span>
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary shadow-sm hover:border-primary/50 focus:shadow-md transition-all"
                placeholder={t("namePlaceholder")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-1.5">
                {t("emailLabel")} <span className="text-error">*</span>
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary shadow-sm hover:border-primary/50 focus:shadow-md transition-all"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">{t("phoneLabel")}</label>
            <input
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary shadow-sm hover:border-primary/50 focus:shadow-md transition-all text-start"
              placeholder={t("phonePlaceholder")}
              dir={locale === "tr" ? "ltr" : "rtl"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">
              {t("message")} <span className="text-error">*</span>
            </label>
            <textarea
              required
              rows={5}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-4 focus:ring-primary/30 focus:border-primary shadow-sm hover:border-primary/50 focus:shadow-md transition-all"
              placeholder={t("messagePlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 transition-all"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={18} />
                {t("send")}
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
