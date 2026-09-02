import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/jsonld";
import { getBaseUrl, getPageAlternates } from "@/lib/site-url";
import { getCmsPageSeo } from "@/lib/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const seo = await getCmsPageSeo("/treatment-journey", locale, {
    title: isTr ? "Tedavi Süreci | Ruqya Center" : "الرحلة العلاجية | خطوات العلاج والشفاء",
    description: isTr
      ? "Ruqya Center tedavi aşamaları, takip ve şifa süreci."
      : "تعرف على مراحل الخطوات العلاجية من التشخيص وحتى التعافي التام بإذن الله.",
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: seo.og_image_url ? { images: [seo.og_image_url] } : undefined,
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
      <h2 className="sr-only">{isTr ? "Ruqya Center Adım Adım Tedavi ve Şifa Yolculuğu" : "مراحل رحلة العلاج والتعافي التام بمركز الرقية الشرعية"}</h2>
      <div className="sr-only">
        <h2>{isTr ? "Manevi Tedavi Aşamaları ve Bireysel Takip Süreci" : "خطوات ومراحل البرامج العلاجية المخصصة للمرضى والمستفيدين"}</h2>
        <p>
          {isTr
            ? "Ruqya Center bünyesinde uygulanan adım adım tedavi süreci: İlk teşhis seansı, kişiselleştirilmiş ruqya programı, günlük zikir ve korunma ödevleri, düzenli doktor ve معالج takibi ile tam manevi şifa hedeflenmektedir. Tedavi sürecimiz şeffaf, güvenilir ve tamamen Kur'an ve Sünnet temellidir."
            : "نقدم في مركز الرقية بكلام الرحمن منهجاً علاجياً واضحاً ومبرمجاً يعتمد على مراحل متتالية تبدأ بالتشخيص الدقيق واستكشاف نوع الإصابة (عين، حسد، سحر، أو مس)، ثم تصميم البرنامج العلاجي المناسب المكون من الرقية المباشرة والورد اليومي والمتابعة الدورية حتى الشفاء التام بإذن الله تعالى."}
        </p>
        <h3>{isTr ? "Tedavinin 4 Temel Aşaması" : "المراحل الأربع الأساسية لرحلة العلاج"}</h3>
        <ol>
          {isTr ? (
            <>
              <li>İlk Teşhis ve Durum Analizi: Semptomların belirlenmesi.</li>
              <li>Özel Tedavi Programının Hazırlanması: Ayetler ve zikirler.</li>
              <li>Uygulama ve Seanslar: Birebir canlı ruqya ve ev programı.</li>
              <li>Değerlendirme ve Korunma: Şifa sonrası manevi zırh.</li>
            </>
          ) : (
            <>
              <li>مرحلة التشخيص والتقييم الأولية: تحديد نوع وطبيعة الحالة.</li>
              <li>مرحلة بناء البرنامج العلاجي المخصص: تحديد السور والتحصينات.</li>
              <li>مرحلة الجلسات والمتابعة المباشرة: الرقية الفردية والتوجيه المستمر.</li>
              <li>مرحلة التعافي والتحصين النهائي: الوقاية الدائمة ومنع الانتكاس.</li>
            </>
          )}
        </ol>
      </div>
      {children}
    </>
  );
}
