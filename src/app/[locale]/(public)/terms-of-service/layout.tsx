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
      <div className="sr-only">
        <h2>{isTr ? "Hizmet ve Kullanım Şartları" : "شروط وأحكام استخدام خدمات مركز الرقية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center web sitesini ve danışmanlık hizmetlerini kullanırken tabi olunan genel şartlar, randevu kuralları ve hizmet politikaları."
            : "تحدد هذه الوثيقة الضوابط والشروط الشاملة لاستخدام الخدمات والاستشارات والرقية الشرعية المقدمة عبر موقع مركز الرقية الشرعية، بالإضافة إلى سياسة المواعيد والإلغاء."}
        </p>
      </div>
      {children}
    </>
  );
}
