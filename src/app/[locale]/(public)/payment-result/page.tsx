"use client";

import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { CheckCircle, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PaymentResultPage() {
  const searchParams = useSearchParams();
  const t = useTranslations("Booking");
  const tranRef = searchParams.get("tranRef") || searchParams.get("tran_ref");
  
  // Note: For a robust system, we should verify the `tranRef` with the backend.
  // ClickPay will also send a webhook to confirm payment definitively.
  const isSuccess = !!tranRef && searchParams.get("respStatus") !== "E";

  if (!isSuccess) {
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

        {tranRef && (
          <div className="bg-primary/5 rounded-xl p-6 mb-8 max-w-sm mx-auto text-sm border border-primary/10">
            <p className="text-text-secondary mb-1">رقم المعاملة (المرجع)</p>
            <p className="font-medium text-text-primary font-mono">{tranRef}</p>
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
