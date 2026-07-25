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
    title: isTr ? "Tedavi Süreci" : "رحلة العلاج",
    description: isTr
      ? "Ruqya Center tedavi aşamaları, takip ve şifa süreci."
      : "تعرف على مراحل الخطوات العلاجية من التشخيص وحتى التعافي التام بإذن الله.",
    alternates: getPageAlternates(locale, "/treatment-journey"),
  };
}

export default async function TreatmentJourneyLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/treatment-journey`;
  const trUrl = `${baseUrl}/tr/treatment-journey`;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "Tedavi Süreci" : "رحلة العلاج", url: isTr ? trUrl : arUrl },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
