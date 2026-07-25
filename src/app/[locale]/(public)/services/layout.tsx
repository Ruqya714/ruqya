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
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <h1 className="sr-only">{isTr ? "Ruqya Center Manevi Tedavi ve Danışmanlık Hizmetleri" : "الخدمات العلاجية والتشخيصية لمركز الرقية بكلام الرحمن"}</h1>
      <div className="sr-only">
        <h2>{isTr ? "Manevi Tedavi ve Şifa Hizmetleri Rehberi" : "دليل خدمات الرقية الشرعية والعلاج بالقرآن الكريم والاستشارات الروحانية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center bünyesinde sunulan uzman manevi teşhis, birebir ruqya seansları, aile danışmanlığı, korunma programları ve manevi şifa rehberliği hakkında detaylı bilgilere ulaşabilirsiniz. Tüm hizmetlerimiz Kur'an-ı Kerim ayetleri ve Sahih Sünnet usullerine tam uygunlukla yürütülmektedir."
            : "يقدم مركز الرقية الشرعية منظومة متكاملة من الخدمات التشخيصية والعلاجية الشاملة تعتمد كلياً على الكتاب والسنة المطهرة. تتنوع خدماتنا لتلبي احتياجات المرضى والمستفيدين سواء عبر الإنترنت من أي مكان في العالم أو عبر الزيارات المباشرة للمركز المعتمد في إسطنبول."}
        </p>
        <h3>{isTr ? "Ana Hizmet Kategorilerimiz" : "أبرز الأقسام والخدمات المتوفرة"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Manevi Teşhis ve Durum Analizi Seansları.</li>
              <li>Birebir Canlı Canlı Canlı Ruqya Şifa Seansı.</li>
              <li>Nazar, Haset ve Büyü İptali Tedavi Programları.</li>
              <li>Aile Manevi Danışmanlık ve Ev Korunma Zırhı.</li>
            </>
          ) : (
            <>
              <li>جلسات التشخيص الروحاني المباشر وتقييم الحالة المرضية.</li>
              <li>جلسات الرقية الشرعية الفردية والمباشرة بالصوت والصورة أونلاين.</li>
              <li>برامج إبطال العين والحسد والسحر والتحصين الشامل.</li>
              <li>الاستشارات الأسرية والتأهيل النفسي والسلوكي القائم على القرآن.</li>
            </>
          )}
        </ul>
      </div>
      {children}
    </>
  );
}
