import type { Metadata } from "next";
import { getPageAlternates } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Kullanım Şartları" : "شروط الاستخدام",
    description: isTr
      ? "Ruqya Center hizmet kullanım şartları ve yasal sözleşme."
      : "شروط وأحكام استخدام الاستشارات والخدمات في مركز الرقية الشرعية.",
    alternates: getPageAlternates(locale, "/terms-of-service"),
  };
}

export default async function TermsLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";

  return (
    <>
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <h2 className="sr-only">{isTr ? "Ruqya Center Hizmet Kullanım Şartları ve Yasal Sözleşme" : "شروط وأحكام استخدام خدمات مركز الرقية بكلام الرحمن"}</h2>
      <div className="sr-only">
        <h2>{isTr ? "Hizmet ve Kullanım Şartları Prensipleri" : "الضوابط والشروط الأحكام الشاملة للاستشارات والخدمات العلاجية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center web sitesini, online manevi danışmanlık hizmetlerini ve randevu sistemini kullanırken tabi olunan genel şartlar, kullanım kuralları, randevu iptal ve değişiklik politikaları ile yasal haklar bu dokümanda açıklanmaktadır."
            : "تحدد هذه الوثيقة الضوابط والشروط والأحكام الشاملة لاستخدام الخدمات والاستشارات والرقية الشرعية المقدمة عبر موقع مركز الرقية بكلام الرحمن، بالإضافة إلى سياسة المواعيد، الإلغاء، والتزام الطرفين بالضوابط الشرعية والقانونية."}
        </p>
      </div>
      {children}
    </>
  );
}
