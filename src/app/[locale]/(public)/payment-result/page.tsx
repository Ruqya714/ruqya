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
  const urlBookingId = searchParams.get("booking_id") || searchParams.get("merchant_order_id");
  const fallbackBookingId = searchParams.get("amp;booking_id") || searchParams.get("amp;%3Bbooking_id") || searchParams.get("amp;merchant_order_id");
  const statusParam = searchParams.get("status") || searchParams.get("result") || searchParams.get("payment_status");
  const tranRef = searchParams.get("tranRef") || searchParams.get("tran_ref") || searchParams.get("transaction_id");
  
  const [activeBookingId, setActiveBookingId] = useState<string | null>(urlBookingId || fallbackBookingId);

  const isPaid = statusParam === "paid" || 
                 statusParam === "success" || 
                 statusParam === "completed" || 
                 searchParams.get("result") === "success" || 
                 searchParams.get("payment_status") === "paid";

  const isFailed = !isPaid && (statusParam?.includes("fail") || statusParam?.includes("cancel") || searchParams.get("result") === "failure");

  const [verifiedStatus, setVerifiedStatus] = useState<"loading" | "paid" | "failed">(
    isPaid ? "paid" : isFailed ? "failed" : "loading"
  );
  const [isRetrying, setIsRetrying] = useState(false);

  // Initialize booking ID from localStorage if URL parameter was missing
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
    if (isPaid) {
      setVerifiedStatus("paid");
      if (activeBookingId) {
        fetch(`/api/payment/mtjree-status?booking_id=${activeBookingId}&status=paid`).catch(console.error);
      }
      return;
    }

    if (isFailed) {
      setVerifiedStatus("failed");
      return;
    }

    async function verifyPayment() {
      const idToVerify = activeBookingId;
      
      if (!idToVerify) {
        setVerifiedStatus(isPaid || !!tranRef ? "paid" : "failed");
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
        await new Promise(resolve => setTimeout(resolve, 2500));
        const retryRes = await fetch(`/api/payment/mtjree-status?booking_id=${idToVerify}`);
        const retryData = await retryRes.json();

        if (retryData.payment_status === "paid" || isPaid) {
          setVerifiedStatus("paid");
        } else {
          setVerifiedStatus("failed");
        }
      } catch (error) {
        console.error("Failed to verify payment:", error);
        setVerifiedStatus(isPaid ? "paid" : "failed");
      }
    }

    if (activeBookingId || urlBookingId) {
      verifyPayment();
    } else {
      const timer = setTimeout(verifyPayment, 100);
      return () => clearTimeout(timer);
    }
  }, [activeBookingId, urlBookingId, isPaid, isFailed, tranRef]);

  // Direct Retry payment handler (No form refill required)
  const handleRetryPayment = async () => {
    if (!activeBookingId || isRetrying) return;
    setIsRetrying(true);

    try {
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
        alert(data.error || "فشل في إعادة إنشاء رابط الدفع - يُرجى المحاولة لاحقاً");
        setIsRetrying(false);
      }
    } catch (error) {
      console.error("Retry payment error:", error);
      alert("حدث خطأ أثناء إعادة المحاولة");
      setIsRetrying(false);
    }
  };

  // Loading state
  if (verifiedStatus === "loading") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-border p-8 lg:p-12 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center mb-6">
            <Loader2 size={40} className="text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            جاري التحقق من عملية الدفع...
          </h2>
          <p className="text-text-secondary leading-relaxed text-sm">
            يرجى الانتظار لحظات بينما نتأكد من حالة الدفع وتأكيد الحجز
          </p>
        </div>
      </div>
    );
  }

  // Failed state
  if (verifiedStatus === "failed") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-3xl border border-border p-8 lg:p-12 shadow-sm">
          <div className="w-20 h-20 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-6">
            <XCircle size={40} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            فشلت عملية الدفع
          </h2>
          <p className="text-text-secondary leading-relaxed mb-8 text-sm">
            عذراً، لم تكتمل عملية الدفع. تم حفظ بيانات حجزك ويمكنك إعادة المحاولة مباشرة دون إعادة إدخال بياناتك.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {activeBookingId && (
              <button
                onClick={handleRetryPayment}
                disabled={isRetrying}
                className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-all shadow-sm hover:shadow-md disabled:opacity-60 text-sm cursor-pointer"
              >
                {isRetrying ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                {isRetrying ? "جاري فتح صفحة الدفع..." : "إعادة محاولة الدفع مباشرة"}
              </button>
            )}
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl border border-border text-text-primary font-bold hover:bg-gray-50 transition-all text-sm"
            >
              حجز موعد جديد
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  const transactionIdParam = searchParams.get("transaction_id") || searchParams.get("tranRef") || searchParams.get("tran_ref") || searchParams.get("order_id") || searchParams.get("orderId") || searchParams.get("order_number");
  const displayReference = transactionIdParam || activeBookingId;

  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="bg-white rounded-3xl border border-border p-8 lg:p-12 shadow-sm">
        <div className="w-20 h-20 rounded-full bg-green-50 mx-auto flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-3">
          {locale === "tr" ? "Randevunuz ve Ödemeniz Başarıyla Onaylandı!" : "تم تأكيد حجزك وسداد الرسوم بنجاح!"}
        </h2>
        <p className="text-text-secondary leading-relaxed mb-6 text-sm max-w-lg mx-auto">
          {locale === "tr" 
            ? "Ödemeniz alındı ve sesli danışmanlık randevunuz başarıyla onaylandı. Randevu detayları ve seans bağlantısı e-posta adresinize gönderilecektir." 
            : "تم استلام الدفعة وتأكيد موعد الاستشارة الصوتية بنجاح. سيتم إرسال تفاصيل الموعد ورابط الجلسة إلى بريدك الإلكتروني."}
        </p>

        {displayReference && (
          <div className="bg-primary/5 rounded-2xl p-4 mb-8 border border-primary/10 inline-block text-center min-w-[240px]">
            <span className="text-xs text-text-muted block mb-1">
              {locale === "tr" ? "İşlem Numarası (Transaction ID)" : "رقم المعاملة (Transaction ID)"}
            </span>
            <span className="text-base font-mono font-bold text-primary">{displayReference}</span>
          </div>
        )}

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3.5 rounded-xl bg-primary text-white font-bold hover:bg-primary-light transition-all shadow-sm text-sm"
          >
            {locale === "tr" ? "Ana Sayfaya Dön" : "العودة للرئيسية"}
          </Link>
        </div>
      </div>
    </div>
  );
}
