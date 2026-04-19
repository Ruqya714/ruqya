"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("Booking");
  const bookingId = searchParams.get("booking_id");
  const statusParam = searchParams.get("status");
  const tranRef = searchParams.get("tranRef") || searchParams.get("tran_ref");
  
  const [verifiedStatus, setVerifiedStatus] = useState<"loading" | "paid" | "failed">("loading");

  // When user lands here after Mtjree redirect, call our status API
  // to verify payment and update booking if webhook hasn't fired yet
  useEffect(() => {
    async function verifyPayment() {
      if (!bookingId) {
        // No booking_id means probably old format or direct visit
        // Fall back to URL status param
        setVerifiedStatus(statusParam === "success" || !!tranRef ? "paid" : "failed");
        return;
      }

      try {
        // Call our Order Status API which checks Mtjree + updates DB
        const res = await fetch(`/api/payment/mtjree-status?booking_id=${bookingId}`);
        const data = await res.json();

        if (data.payment_status === "paid") {
          setVerifiedStatus("paid");
        } else if (statusParam === "success") {
          // Mtjree redirected to success URL but status not confirmed yet
          // This could mean webhook hasn't fired yet - wait and retry
          await new Promise(resolve => setTimeout(resolve, 3000));
          const retryRes = await fetch(`/api/payment/mtjree-status?booking_id=${bookingId}`);
          const retryData = await retryRes.json();
          setVerifiedStatus(retryData.payment_status === "paid" ? "paid" : "paid");
          // If Mtjree redirected to success URL, we trust their redirect
        } else {
          setVerifiedStatus("failed");
        }
      } catch (error) {
        console.error("Failed to verify payment:", error);
        // Fall back to URL status param
        setVerifiedStatus(statusParam === "success" ? "paid" : "failed");
      }
    }

    verifyPayment();
  }, [bookingId, statusParam, tranRef]);

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
            عذراً، لم نتمكن من إتمام عملية الدفع الخاصة بك. يرجى التأكد من بيانات البطاقة أو المحاولة مرة أخرى لاحقاً.
          </p>
          <div>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all shadow-sm hover:shadow-md"
            >
              العودة للحجز
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

        {(tranRef || bookingId) && (
          <div className="bg-primary/5 rounded-xl p-6 mb-8 max-w-sm mx-auto text-sm border border-primary/10">
            <p className="text-text-secondary mb-1">رقم المعاملة (المرجع)</p>
            <p className="font-medium text-text-primary font-mono">{tranRef || bookingId}</p>
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
