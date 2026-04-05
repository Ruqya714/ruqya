"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageCircle, Clock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from("contact_messages").insert({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
      });

      if (insertError) {
        console.error(insertError);
      }

      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError(t("error"));
    } finally {
      setIsLoading(false);
    }
  };

  const contactItems = [
    { icon: <Phone size={20} />, label: t("phone"), value: "+90 XXX XXX XXXX", dir: "ltr" as const },
    { icon: <MessageCircle size={20} />, label: t("whatsapp"), value: "+90 XXX XXX XXXX", dir: "ltr" as const },
    { icon: <Mail size={20} />, label: t("email"), value: "info@ruqyah-center.com", dir: "ltr" as const },
    { icon: <MapPin size={20} />, label: t("address"), value: t("addressValue"), dir: "rtl" as const },
    { icon: <Clock size={20} />, label: t("workHours"), value: t("workHoursValue"), dir: "rtl" as const },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 right-20 w-96 h-96 rounded-full bg-primary-light blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">{t("heroTitle")}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">{t("heroDesc")}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact info */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text-primary mb-6">{t("infoTitle")}</h2>
              {contactItems.map((item, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white border border-border hover:border-primary/20 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text-primary">{item.label}</p>
                    <p className="text-sm text-text-secondary mt-0.5" dir={item.dir}>{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact form */}
            <div className="lg:col-span-2">
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
                          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                          className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                        className="w-full px-4 py-2.5 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        placeholder={t("phonePlaceholder")}
                        dir="rtl"
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
                        className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
