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

  const courseSchema = getCourseSchema(coursesList, locale);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={courseSchema} />
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <div className="sr-only">
        <h2>{isTr ? "Ruqya ve Manevi Şifa Kursları" : "دورات تأهيل وتدريب المعالجين والرقاة"}</h2>
        <p>
          {isTr
            ? "Ruqya Center eğitim programları ile Kuran ve Sünnet ışığında manevi teşhis, ruqya teknikleri ve korunma duaları konularında uzmanlık kazanın."
            : "دورات تعليمية وتأهيلية متقدمة تهدف لترسيخ القواعد الشرعية والضوابط العلمية للرقية والتأهيل الروحاني المعتمد."}
        </p>
      </div>
      {children}
    </>
  );
}
