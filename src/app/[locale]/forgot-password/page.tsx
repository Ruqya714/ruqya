"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, CheckCircle, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const t = useTranslations("ForgotPassword");
  const [stage, setStage] = useState<"ENTRY" | "OTP" | "SUCCESS">("ENTRY");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("كلمات المرور غير متطابقة.");
      return;
    }

    if (password.length < 6) {
      setError("كلمة المرور يجب أن تتكون من 6 أحرف على الأقل.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);

      if (resetError) {
        setError("تعذر إرسال الكود. يرجى التحقق من البريد والمحاولة لاحقاً.");
        return;
      }

      setStage("OTP");
    } catch {
      setError("حدث خطأ غير متوقع.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (otpCode.length < 6) {
      setError("الرجاء إدخال الكود المكون من 6 أرقام بشكل صحيح.");
      return;
    }

    setIsLoading(true);

    try {
      const supabase = createClient();
      
      // 1. Verify OTP and login simultaneously
      const { error: otpError } = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: "recovery"
      });

      if (otpError) {
        setError("الكود غير صحيح أو منتهي الصلاحية.");
        return;
      }

      // 2. We now have a session securely, update the password to what they requested
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        setError("حدث خطأ أثناء تحديث كلمة المرور، يرجى المحاولة مرة أخرى.");
        return;
      }

      setStage("SUCCESS");
    } catch {
      setError("حدث خطأ غير متوقع.");
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
          
          {stage === "SUCCESS" && (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-4">
                <CheckCircle size={32} className="text-green-500" />
              </div>
              <h2 className="text-xl font-bold text-text-primary mb-2">تم التحديث بنجاح!</h2>
              <p className="text-sm text-text-secondary leading-relaxed">تم تغيير كلمة المرور بنجاح، يمكنك الآن تسجيل الدخول.</p>
              
              <Link href="/login" className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all duration-200 shadow-sm">
                <ArrowRight size={18} />
                العودة لتسجيل الدخول
              </Link>
            </div>
          )}

          {stage === "OTP" && (
            <>
              <div className="mb-6 text-center">
                <h2 className="text-2xl font-bold text-text-primary mb-2">أدخل رمز التحقق</h2>
                <p className="text-sm text-text-secondary">قمنا بإرسال رمز تحقق صالح لمرة واحدة إلى إيميلك:</p>
                <div className="font-semibold text-primary mt-1" dir="ltr">{email}</div>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">{error}</div>
              )}

              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <label htmlFor="otpCode" className="block text-sm font-medium text-text-primary mb-1.5 text-center">رمز التحقق السداسي (OTP)</label>
                  <input id="otpCode" type="text" inputMode="numeric" required maxLength={6} value={otpCode} onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} placeholder="123456"
                    className="w-full px-4 py-4 text-center tracking-[1em] text-2xl font-bold rounded-lg border border-border bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" dir="ltr" />
                </div>

                <button type="submit" disabled={isLoading || otpCode.length < 6}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle size={18} />
                      تأكيد وتغيير
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          {stage === "ENTRY" && (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-text-primary">نسيت كلمة المرور</h2>
                <p className="text-sm text-text-secondary mt-2">أدخل بريدك الإلكتروني وكلمة المرور الجديدة لإرسال كود التأكيد.</p>
              </div>

              {error && (
                <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">{error}</div>
              )}

              <form onSubmit={handleSendCode} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">{t("email")}</label>
                  <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="example@email.com"
                    className="w-full px-4 py-3 rounded-lg border border-border text-sm bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" dir="ltr" />
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-text-primary mb-1.5">كلمة المرور الجديدة</label>
                  <div className="relative">
                    <input id="newPassword" type={showPassword ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-border text-sm bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10" dir="ltr" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors" tabIndex={-1}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary mb-1.5">تأكيد كلمة المرور</label>
                  <div className="relative">
                    <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••"
                      className="w-full px-4 py-3 rounded-lg border border-border text-sm bg-white placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all pr-10" dir="ltr" />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors" tabIndex={-1}>
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm">
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Mail size={18} />
                        إرسال كود التحقق
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>

        {stage !== "SUCCESS" && (
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors">
              <ArrowRight size={16} />
              {t("backToLogin")}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
