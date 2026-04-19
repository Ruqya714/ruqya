"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("Booking");
  const locale = useLocale();
  const urlBookingId = searchParams.get("booking_id");
  const fallbackBookingId = searchParams.get("amp;booking_id") || searchParams.get("amp;%3Bbooking_id"); // in case of MTJREE encoding glitches
  const statusParam = searchParams.get("status");
  const tranRef = searchParams.get("tranRef") || searchParams.get("tran_ref");
  
  const [activeBookingId, setActiveBookingId] = useState<string | null>(urlBookingId || fallbackBookingId);
  const [verifiedStatus, setVerifiedStatus] = useState<"loading" | "paid" | "failed">(
    statusParam?.includes("failed") ? "failed" : "loading"
  );
  const [isRetrying, setIsRetrying] = useState(false);

  // Initialize booking ID from localStorage if URL parameter was corrupted by gateway
  useEffect(() => {
    if (!activeBookingId) {
      try {
        const pending = localStorage.getItem("mtjree_pending_booking");
        if (pending) {
          const data = JSON.parse(pending);
          if (data.booking_id) {
            setActiveBookingId(data.booking_id);
          }
        }
      } catch (e) {
        console.error("Failed to parse pending booking", e);
      }
    }
  }, [activeBookingId]);

  useEffect(() => {
    if (statusParam?.includes("failed")) return;

    async function verifyPayment() {
      // Use activeBookingId from state (which might be populated from localStorage)
      const idToVerify = activeBookingId;
      
      if (!idToVerify) {
        setVerifiedStatus(statusParam?.includes("success") || !!tranRef ? "paid" : "failed");
        return;
      }

      try {
        const res = await fetch(`/api/payment/mtjree-status?booking_id=${idToVerify}`);
        const data = await res.json();

        if (data.payment_status === "paid") {
          setVerifiedStatus("paid");
          return;
        }

        // Wait and retry if webhook hasn't fired yet
        await new Promise(resolve => setTimeout(resolve, 3000));
        const retryRes = await fetch(`/api/payment/mtjree-status?booking_id=${idToVerify}`);
        const retryData = await retryRes.json();

        if (retryData.payment_status === "paid") {
          setVerifiedStatus("paid");
        } else if (statusParam?.includes("success")) {
          setVerifiedStatus("paid");
        } else {
          setVerifiedStatus("failed");
        }
      } catch (error) {
        console.error("Failed to verify payment:", error);
        setVerifiedStatus(statusParam?.includes("success") ? "paid" : "failed");
      }
    }

    // Give the localstorage effect above a moment to run
    if (activeBookingId || urlBookingId) {
      verifyPayment();
    } else {
      // wait a bit for local storage check
      const timer = setTimeout(verifyPayment, 100);
      return () => clearTimeout(timer);
    }
  }, [activeBookingId, urlBookingId, statusParam, tranRef]);

  // Retry payment handler
  const handleRetryPayment = async () => {
    if (!activeBookingId || isRetrying) return;
    setIsRetrying(true);

    try {
      // Save to localStorage for redirect detection (same as initial payment)
      localStorage.setItem("mtjree_pending_booking", JSON.stringify({
        booking_id: activeBookingId,
        locale: locale,
        timestamp: Date.now()
      }));

      const res = await fetch("/api/payment/mtjree-retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ booking_id: activeBookingId, locale })
      });

      const data = await res.json();
      if (res.ok && data.redirect_url) {
        window.location.href = data.redirect_url;
      } else {
        alert(data.error || "فشل في إعادة إنشاء رابط الدفع");
        localStorage.removeItem("mtjree_pending_booking");
        setIsRetrying(false);
      }
    } catch (error) {
      console.error("Retry payment error:", error);
      alert("حدث خطأ أثناء إعادة المحاولة");
      localStorage.removeItem("mtjree_pending_booking");
      setIsRetrying(false);
    }
  };

  // Loading state
  if (verifiedStatus === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-border p-8 lg:p-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6">
            <Loader2 size={40} className="text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            جاري التحقق من عملية الدفع...
          </h2>
          <p className="text-text-secondary leading-relaxed">
            يرجى الانتظار لحظات بينما نتأكد من حالة الدفع الخاصة بك
          </p>
        </div>
      </div>
    );
  }

  // Failed state
  if (verifiedStatus === "failed") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl border border-border p-8 lg:p-12">
          <div className="w-20 h-20 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            فشلت عملية الدفع
          </h2>
          <p className="text-text-secondary leading-relaxed mb-8">
            عذراً، لم نتمكن من إتمام عملية الدفع الخاصة بك. يرجى التأكد من بيانات البطاقة أو المحاولة مرة أخرى.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {activeBookingId && (
              <button
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all shadow-sm hover:shadow-md disabled:opacity-60"
              >
                {isRetrying ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                {isRetrying ? "جاري إعادة المحاولة..." : "إعادة محاولة الدفع"}
              </button>
            )}
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg border border-border text-text-primary font-medium hover:bg-gray-50 transition-all"
            >
              حجز جديد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-2xl border border-border p-8 lg:p-12">
        <div className="w-20 h-20 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          {t("success.title")}
        </h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          تمت عملية الدفع وتأكيد الحجز بنجاح. سيصلك إيميل بالتفاصيل المعتمدة.
        </p>

        {(tranRef || activeBookingId) && (
          <div className="bg-gray-50 rounded-xl p-5 mb-8 max-w-xs mx-auto border border-gray-100 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]">
            <p className="text-text-secondary text-sm mb-2">رقم المعاملة (المرجع)</p>
            <div className="inline-flex items-center justify-center bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
              <p className="font-bold text-primary tracking-wider font-mono text-lg">
                #{String(tranRef || activeBookingId).split("-")[0].substring(0, 8).toUpperCase()}
              </p>
            </div>
          </div>
        )}

        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all shadow-sm hover:shadow-md"
          >
            {t("success.backToHome")}
          </Link>
        </div>
        <p className="text-xs text-text-muted mt-6">{t("success.prayer")}</p>
      </div>
    </div>
  );
}
