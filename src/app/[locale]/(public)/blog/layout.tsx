import type { Metadata } from "next";
import { getPageAlternates } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Blog ve Makaleler" : "المدونة والمقالات",
    description: isTr
      ? "Ruqya Center manevi şifa, Kuran ve sünnet ışığında rehber makaleler ve bilgi deposu."
      : "مقالات شرعية وعلمية موثوقة حول التحصين اليومي، أذكار الصباح والمساء، والعلاج بالقرآن.",
    alternates: getPageAlternates(locale, "/blog"),
  };
}

export default async function BlogListLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";

  return (
    <>
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <h2 className="sr-only">{isTr ? "Ruqya Center Blog ve Manevi Şifa Rehberi" : "المدونة الشرعية والمقالات العلمية لمركز الرقية بكلام الرحمن"}</h2>
      <div className="sr-only">
        <h2>{isTr ? "Manevi Şifa ve Ruqya Makaleleri Kütüphanesi" : "مكتبة مقالات وتوجيهات الرقية الشرعية والعلاج بالقرآن والتأهيل النفسي"}</h2>
        <p>
          {isTr
            ? "Ruqya Center blog sayfasında Kur'an-ı Kerim ve Sünnet-i Seniyye ışığında manevi şifa, nazar, büyü, vesvese ve ruhsal sıkıntılar hakkında uzman المعالج kadromuz tarafından kaleme alınmış detaylı rehberler, bilimsel ve manevi makaleler bulabilirsiniz. Günlük korunma duaları, sabah akşam zikirleri, manevi korunma teknikleri ve aile içi huzur rehberleri kütüphanemizde sürekli güncellenmektedir."
            : "يقدم مركز الرقية الشرعية عبر مدونته العلمية مكتبة شاملة من المقالات التأصيلية والتطبيقية الموثوقة لتوعية المسلم بسبل التحصين الذاتي، والوقاية من العين والحسد والسحر والمس والوسواس. نهدف من خلال هذه المقالات إلى تصحيح المفاهيم الخاطئة وتوفير برامج عملية تعتمد على آيات القرآن الكريم والأحاديث النبوية الصحيحة."}
        </p>
        <h3>{isTr ? "Öne Çıkan Konular ve Rehberler" : "أبرز التصنيفات والمواضيع المعرفية"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Nazar ve Haset Belirtileri ve Manevi Tedavi Yolları.</li>
              <li>Sabah ve Akşam Zikirlerinin Manevi Zırh Rolü.</li>
              <li>Evde Kur'an Okuma ve Manevi Temizlik Metotları.</li>
              <li>Psikolojik Rahatsızlıklar ile Manevi Sıkıntıların Farkı.</li>
            </>
          ) : (
            <>
              <li>علامات وأعراض العين والحسد والفرق بينها وبين الأمراض النفسية.</li>
              <li>فضل وقوة أذكار الصباح والمساء والتحصينات النبوية اليومية.</li>
              <li>طريقة رقية البيت والأهل بالقرآن الكريم والماء والمرقاة.</li>
              <li>الخطوات العملية للتحصين والوقاية الذاتية المستمرة.</li>
            </>
          )}
        </ul>
        <h3>{isTr ? "Bilgi Deposu ve Manevi Rehberlik" : "التوعية والإرشاد المعرفي المستمر"}</h3>
        <p>
          {isTr
            ? "Makalelerimiz her yaştan okuyucu için anlaşılır ve sade bir dille hazırlanmış olup manevi yolculuğunuzda size rehberlik etmeyi amaçlar. Sürekli eklenen yeni içeriklerimizi takip ederek şifa sürecinizi destekleyebilirsiniz."
            : "حرصنا على كتابة المقالات بلغة سهلة ومباشرة تجمع بين الأصالة الشرعية والدقة الفكرية لمساعدة كل مريض وباحث عن الشفاء في فهم حالته والتعامل معها بوعي وطمأنينة."}
        </p>
      </div>
      {children}
    </>
  );
}
