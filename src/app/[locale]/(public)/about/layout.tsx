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
    title: isTr ? "Hakkımızda" : "من نحن",
    description: isTr
      ? "Ruqya Center hakkında detaylı bilgi, vizyonumuz ve uzman kadromuz."
      : "تعرف على مركز الرقية بكلام الرحمن، رؤيتنا، وخبرائنا المتخصصين في العلاج بالقرآن.",
    alternates: getPageAlternates(locale, "/about"),
  };
}

export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/about`;
  const trUrl = `${baseUrl}/tr/about`;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "Hakkımızda" : "من نحن", url: isTr ? trUrl : arUrl },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
