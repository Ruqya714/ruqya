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
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <div className="sr-only">
        <h2>{isTr ? "Ruqya Center Hakkında ve Misyonumuz" : "عن مركز الرقية بكلام الرحمن ورؤيتنا العلاجية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center, Kur'an-ı Kerim ve Sünnet-i Seniyye ilkelerine bağlı kalarak manevi danışmanlık ve şifa hizmetleri sunan güvenilir bir kurumdur. Uzman kadromuz ile ruhsal ve manevi rahatsızlıklarda doğru diagnosis ve tedavi metodları uyguluyoruz."
            : "مركز الرقية بكلام الرحمن مؤسسة علاجية وتوعوية متخصصة تعتمد الكتاب والسنة النبوية في تقديم الرقية الشرعية والاستشارات الروحانية، تحت إشراف نخبة من الرقاة والمعالجين المعتمدين."}
        </p>
      </div>
      {children}
    </>
  );
}
