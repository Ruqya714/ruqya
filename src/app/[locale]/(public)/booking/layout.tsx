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
    title: isTr ? "Randevu Al" : "حجز استشارة",
    description: isTr
      ? "Ruqya Center'dan uzmanlarımızla görüşmek için hemen randevu oluşturun."
      : "احجز موعد استشارة أو جلسة رقية شرعية مع أطبائنا ومعالجينا المعتمدين.",
    alternates: getPageAlternates(locale, "/booking"),
  };
}

export default async function BookingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/booking`;
  const trUrl = `${baseUrl}/tr/booking`;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "Randevu Al" : "حجز استشارة", url: isTr ? trUrl : arUrl },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <div className="sr-only">
        <h2>{isTr ? "Manevi Danışmanlık ve Ruqya Randevusu" : "حجز مواعيد الرقية الشرعية والاستشارات الروحانية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center uzman kadrosundan hızlı ve güvenli bir şekilde online veya yüz yüze randevu alabilirsiniz. Tedavi sürecinizi başlatmak için uygun günü ve saati seçebilirsiniz."
            : "يمكنكم حجز جلسات رقية شرعية واستشارات تشخيصية أونلاين أو مباشرة مع نخبة من الرقاة والمعالجين المعتمدين لتلقي العلاج والمتابعة الدقيقة."}
        </p>
      </div>
      {children}
    </>
  );
}
