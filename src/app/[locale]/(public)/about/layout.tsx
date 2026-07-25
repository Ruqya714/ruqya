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
      <h2 className="sr-only">{isTr ? "Ruqya Center Kurumsal Bilgiler ve Şifa Misyonumuz" : "التعريف بمركز الرقية بكلام الرحمن ورسالتنا السامية"}</h2>
      <div className="sr-only">
        <h2>{isTr ? "Ruqya Center Hakkında ve Misyonumuz" : "عن مركز الرقية بكلام الرحمن ورؤيتنا العلاجية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center, Kur'an-ı Kerim ve Sünnet-i Seniyye ilkelerine tam bağlılıkla manevi danışmanlık, ruqya tedavisi ve psikolojik-manevi şifa hizmetleri sunan uluslararası alanda güvenilir bir kurumdur. Alanında uzman المعالج kadromuz ile ruhsal, zihinsel ve manevi rahatsızlıklarda doğru teşhis ve bilimsel-شرعي tedavi metodları uyguluyoruz."
            : "مركز الرقية بكلام الرحمن هو مؤسسة علاجية واستشارية رائدة تعتمد أصول الكتاب والسنة النبوية الشريفة في تقديم خدمات الرقية الشرعية المعتمدة. نهدف إلى تقديم نهج شرعي نقي بعيداً عن الخرافات والشعوذة، مع توفير بيئة علاجية آمنة وموثوقة لجميع المستفيدين من مختلف دول العالم."}
        </p>
        <h3>{isTr ? "Temel İlke ve Değerlerimiz" : "القيم والمبادئ الأساسية للمركز"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Kur'an ve Sünnet Çizgisinden Ayrılmama İlkesi.</li>
              <li>Tam Gizlilik ve Kişisel Verilerin Korunması.</li>
              <li>Bilimsel ve Manevi Teşhis Metotlarının Sentezi.</li>
              <li>Manevi Destek ve Sürekli Hasta Takip Mimarisi.</li>
            </>
          ) : (
            <>
              <li>الالتزام التام بالمنهج الشرعي الصحيح الخالي من أي بدع أو مخالفات.</li>
              <li>السرية التامة والمحافظة على خصوصية المرضى والمستفيدين.</li>
              <li>الجمع بين التشخيص الدقيق والمتابعة العلاجية المستمرة.</li>
              <li>تقديم التوعية والتحصين الوقائي لحماية الأسرة والمجتمع.</li>
            </>
          )}
        </ul>
      </div>
      {children}
    </>
  );
}
