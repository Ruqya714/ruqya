"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
      });

      if (resetError) {
        setError(t("emailError"));
        return;
      }

      setIsSent(true);
    } catch {
      setError(t("genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg" />
        </div>

        <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-border p-8">
          {isSent ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">{t("successTitle")}</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{t("successDesc")}</p>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary">{t("title")}</h2>
                <p className="text-sm text-text-secondary mt-2">{t("subtitle")}</p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">{t("email")}</label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-border text-sm bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" dir="ltr" />
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Mail size={18} />
                      {t("sendButton")}
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
            <ArrowRight size={16} />
            {t("backToLogin")}
          </Link>
        </div>
      </div>
    </div>
  );
}
