"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const t = useTranslations("Login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(t("invalidCredentials"));
        return;
      }

      const user = authData?.user;

      if (user) {
        const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

        if (redirect) {
          router.push(redirect);
        } else if (profile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/healer");
        }
      }
    } catch {
      setError(t("genericError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side — Brand */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero relative items-center justify-center p-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 start-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-20 end-20 w-96 h-96 rounded-full bg-primary-light blur-3xl" />
        </div>
        <div className="relative text-center text-white max-w-md">
          <Image src="/logo.png" alt="Logo" width={112} height={112} className="w-28 h-28 rounded-full mx-auto mb-8 shadow-xl" />
          <h1 className="text-3xl font-bold mb-4">{t("centerName")}</h1>
          <p className="text-gray-200 text-lg leading-relaxed">{t("centerDesc")}</p>
        </div>
      </div>

      {/* Right side — Login form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-bg">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <Image src="/logo.png" alt="Logo" width={80} height={80} className="w-20 h-20 rounded-full mx-auto mb-4 shadow-lg" />
            <h1 className="text-xl font-bold text-text-primary">{t("centerName")}</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-[var(--shadow-card)] border border-border p-8">
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

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-text-primary">{t("password")}</label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:text-primary-light transition-colors">{t("forgotPassword")}</Link>
                </div>
                <div className="relative">
                  <input id="password" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg border border-border text-sm bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10" dir="ltr" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors" tabIndex={-1}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn size={18} />
                    {t("loginButton")}
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="mt-6 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
              <ArrowRight size={16} />
              {t("backToSite")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
