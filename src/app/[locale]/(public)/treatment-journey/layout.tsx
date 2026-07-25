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
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <div className="sr-only">
        <h2>{isTr ? "Manevi Tedavi Aşamaları ve Rehberlik" : "مراحل رحلة العلاج والتعافي بالقرآن والرقية الشرعية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center bünyesinde uygulanan adım adım tedavi süreci: İlk teşhis, kişiselleştirilmiş ruqya programı, ev ödevleri ve düzenli takip aşamaları ile tam şifa hedeflenmektedir."
            : "خطوات متكاملة ومبرمجة تبدأ بالتشخيص الدقيق واستكشاف الأعراض، ثم تطبيق الرقية الفردية والبرنامج اليومي المعتمد مع المتابعة المستمرة حتى حصول الشفاء التام بإذن الله."}
        </p>
      </div>
      {children}
    </>
  );
}
