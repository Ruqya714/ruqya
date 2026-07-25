import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import { getCourseSchema, getBreadcrumbSchema } from "@/lib/jsonld";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Courses" });
  return {
    title: t("heroTitle"),
    description: t("heroDesc"),
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
  const baseUrl = "https://ruqyacenter.com";

  const courses = [
    {
      name: isTr
        ? "Manevi Şifa ve Ruqya Eğitimi Programı"
        : "برنامج الكورسات والدورات التعليمية في علوم الرقية الشرعية",
      description: isTr
        ? "Kur'an ve Sünnet ışığında manevi şifa, korunma ve ruqya esasları eğitimi."
        : "برنامج تعليمي متكامل للتوعية بعلوم الرقية الشرعية والوقاية والعلاج وفق الكتاب والسنة.",
      url: `${baseUrl}/${locale}/courses`,
    },
  ];

  const courseSchema = getCourseSchema(courses, locale);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: `${baseUrl}/${locale}` },
    { name: isTr ? "Kurslar" : "الكورسات والدورات", url: `${baseUrl}/${locale}/courses` },
  ]);

  return (
    <>
      <JsonLd data={courseSchema} />
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}
