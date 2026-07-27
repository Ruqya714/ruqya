import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema, getCourseSchema } from "@/lib/jsonld";
import { getBaseUrl, getPageAlternates } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Kurslarımız" : "تأهيل ودورات المعالجين",
    description: isTr
      ? "Ruqya ve manevi şifa alanında uzmanlık ve eğitim kursları."
      : "دورات تدريبية متخصصة في تأهيل الرقاة والمعالجين وفق الكتاب والسنة.",
    alternates: getPageAlternates(locale, "/courses"),
  };
}

export default async function CoursesLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/courses`;
  const trUrl = `${baseUrl}/tr/courses`;

  const coursesList = [
    {
      name: isTr ? "Temel Ruqya Eğitimi Programı" : "دورة تأهيل المعالجين المبتدئة",
      description: isTr ? "Manevi şifa prensipleri ve Kuran ile tedavi temelleri." : "تأهيل علمي وعملي لإتقان ضوابط الرقية الشرعية وإبطال السحر.",
      url: isTr ? trUrl : arUrl,
    },
  ];

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "Kurslarımız" : "الدورات والتدريب", url: isTr ? trUrl : arUrl },
  ]);

  const courseSchemas = getCourseSchema(coursesList, locale);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {courseSchemas.map((schema, i) => (
        <JsonLd key={i} data={schema} />
      ))}
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <h2 className="sr-only">{isTr ? "Ruqya Center Eğitim ve Uzmanlık Kursları" : "أكاديمية تأهيل ودورات الرقاة والمعالجين المعتمدة"}</h2>
      <div className="sr-only">
        <h2>{isTr ? "Manevi Şifa ve Ruqya Eğitim Programları" : "برامج تدريب وتأهيل الرقاة والمهتمين بالعلوم الشرعية والطب النبوي"}</h2>
        <p>
          {isTr
            ? "Ruqya Center eğitim akademi programları ile Kur'an-ı Kerim ve Sünnet-i Seniyye ışığında manevi teşhis, ruqya teknikleri, ayetlerle tedavi ilkeleri ve korunma metotları konularında derinlemesine bilgi ve uzmanlık kazanın. Eğitimlerimiz hem yeni başlayanlar hem de manevi danışmanlık alanında kendini geliştirmek isteyen uzmanlar için tasarlanmıştır."
            : "تقدم أكاديمية مركز الرقية بكلام الرحمن برامج تدريبية وتأهيلية متخصصة تهدف إلى إعداد رقاة ومعالجين متقنين للضوابط الشرعية والقواعد العلمية في التعامل مع الحالات والتشخيص الدقيق. تشمل برامجنا دراسة أحكام الرقية الشرعية، فقه الأدعية والتحصينات، وإبطال الشبهات والخرافات في هذا المجال."}
        </p>
        <h3>{isTr ? "Eğitim Müfredatı ve Ders İçerikleri" : "المحاور العلمية والدراسية للدورات"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Kur'an ile Şifa ve Teşhis Esasları Eğitimi.</li>
              <li>Ayeti Kerimeler ve Zikirler ile Manevi Korunma Gücü.</li>
              <li>Psikolojik Durumlar ile Manevi Hastalıkların Ayırt Edilmesi.</li>
              <li>Sünnet Usulü Sağlıklı Yaşam ve Manevi Beslenme Rehberi.</li>
            </>
          ) : (
            <>
              <li>التأصيل الشرعي لفقه الرقية والطب النبوي المستمد من الكتاب والسنة.</li>
              <li>قواعد وأسس التشخيص الفارق بين السحر والعين والمس والاضطرابات النفسية.</li>
              <li>البرامج العلاجية والوقائية للأفراد والعائلات وكيفية إعداد جدول التحصين.</li>
              <li>الأخلاقيات والضوابط الشرعية الواجب توافرها في المعالج والراقي المعتمد.</li>
            </>
          )}
        </ul>
      </div>
      {children}
    </>
  );
}
