import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/jsonld";
import { getBaseUrl, getPageAlternates } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "İletişim" : "اتصل بنا",
    description: isTr
      ? "Ruqya Center iletişim bilgileri, adresimiz ve destek hattımız."
      : "تواصل مع مركز الرقية الشرعية في إسطنبول عبر الهاتف، الواتساب، أو الاستمارة المباشرة.",
    alternates: getPageAlternates(locale, "/contact"),
  };
}

export default async function ContactLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/contact`;
  const trUrl = `${baseUrl}/tr/contact`;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "İletişim" : "اتصل بنا", url: isTr ? trUrl : arUrl },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <div className="sr-only">
        <h2>{isTr ? "Ruqya Center İletişim Bilgileri ve Destek" : "معلومات التواصل والدعم الفني لمركز الرقية الشرعية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center ile iletişime geçin. Uzmanlarımızla doğrudan görüşmek, randevu almak veya adres ve konum bilgisi öğrenmek için telefon, WhatsApp ve e-posta kanallarımız aktiftir."
            : "يسعدنا تواصلكم مع مركز الرقية الشرعية للاستفسار عن العلاج والمواعيد وإرسال الاستشارات المباشرة عبر خط الهاتف المباشر والواتساب أو عبر زيارة موقعنا."}
        </p>
      </div>
      {children}
    </>
  );
}
