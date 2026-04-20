"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Save, ArrowRight, Eye, EyeOff, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function UpdatePasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <UpdatePasswordForm />
    </Suspense>
  );
}

function UpdatePasswordForm() {
  const t = useTranslations("UpdatePassword");
  const searchParams = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check for URL query param errors (e.g. from auth callback redirect)
    const urlError = searchParams.get("error");
    if (urlError) {
      if (urlError === "access_denied") {
        setError("هذا الرابط منتهي الصلاحية أو تم استخدامه من قبل. يرجى العودة وطلب رابط استعادة جديد.");
      } else {
        setError(searchParams.get("error_description") || t("genericError"));
      }
      setIsReady(true);
      return;
    }

    // Wait for Supabase client to pick up tokens from URL hash
    const supabase = createClient();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // Session established from recovery link - form is ready
        setIsReady(true);
      } else if (event === "SIGNED_IN" && session) {
        // Also handle generic sign-in (PKCE flow)
        setIsReady(true);
      }
    });

    // Also check if there's already a session (in case event fired before listener)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setIsReady(true);
      }
    });

    // Timeout fallback - if no session after 3s, show error
    const timeout = setTimeout(() => {
      if (!isReady) {
        setIsReady(true);
        // Only show error if no hash tokens present (direct visit)
        if (!window.location.hash.includes("access_token")) {
          setError("لم يتم العثور على جلسة صالحة. يرجى طلب رابط إعادة تعيين كلمة المرور مرة أخرى.");
        }
      }
    }, 3000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [searchParams, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (searchParams.get("error")) {
        setError("عذراً! لا يمكنك تعيين كلمة مرور عبر هذا الرابط لأنه منتهي الصلاحية. يرجى تكرار الطلب.");
        return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError(t("genericError"));
        return;
      }

      setIsSuccess(true);
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
          {!isReady ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-text-secondary">جاري التحقق من الرابط...</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">{t("successTitle")}</h2>
              <p className="text-sm text-text-secondary leading-relaxed">{t("successDesc")}</p>
              
              <Link href="/login" className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all duration-200 shadow-sm">
                <ArrowRight size={18} />
                {t("backToLogin")}
              </Link>
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
                  <label htmlFor="newPassword" className="block text-sm font-medium text-text-primary mb-1.5">{t("newPassword")}</label>
                  <div className="relative">
                    <input id="newPassword" type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-border text-sm bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10" dir="ltr" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors" tabIndex={-1}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1.5">{t("confirmPassword")}</label>
                  <div className="relative">
                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-border text-sm bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10" dir="ltr" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors" tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={isLoading || password.length < 6 || !!searchParams.get("error")}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm mt-2">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Save size={18} />
                      {t("updateButton")}
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
