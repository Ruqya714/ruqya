import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/jsonld";

export default async function AboutLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = "https://ruqyacenter.com";

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: `${baseUrl}/${locale}` },
    { name: isTr ? "Hakkımızda" : "من نحن", url: `${baseUrl}/${locale}/about` },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
