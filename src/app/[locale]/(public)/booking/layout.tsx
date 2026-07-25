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
      {children}
    </>
  );
}
