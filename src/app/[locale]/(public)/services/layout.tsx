import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getServicesSchema } from "@/lib/jsonld";
import { getBaseUrl, getPageAlternates } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Hizmetlerimiz" : "الخدمات العلاجية",
    description: isTr
      ? "Ruqya Center bünyesinde sunulan tüm manevi tedavi ve danışmanlık hizmetleri."
      : "استكشف خدمات الرقية الشرعية، العلاج بالقرآن، والتشخيص الروحاني أونلاين ومباشر.",
    alternates: getPageAlternates(locale, "/services"),
  };
}

export default async function ServicesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/services`;
  const trUrl = `${baseUrl}/tr/services`;

  const servicesList = [
    {
      name: isTr ? "Manevi Teşhis ve Danışmanlık" : "التشخيص والاستشارة الروحانية",
      description: isTr ? "Detaylı manevi durum analizi ve uzman görüşü." : "جلسة تشخيصية دقيقة لتحديد الحالة وتقديم العلاج المناسب.",
      url: isTr ? trUrl : arUrl,
    },
    {
      name: isTr ? "Birebir Ruqya Seansı" : "جلسات الرقية الشرعية المباشرة",
      description: isTr ? "Uzman kadromuzla birebir şifa seansları." : "جلسات رقيه فردية ومباشرة أونلاين أو في المركز.",
      url: isTr ? trUrl : arUrl,
    },
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "Hizmetlerimiz" : "الخدمات العلاجية", url: isTr ? trUrl : arUrl },
  ]);

  const servicesSchema = getServicesSchema(servicesList, locale);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={servicesSchema} />
      {children}
    </>
  );
}
