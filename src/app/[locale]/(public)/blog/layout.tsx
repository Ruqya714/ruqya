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
      <div className="sr-only">
        <h2>{isTr ? "Manevi Şifa ve Ruqya Makaleleri" : "مقالات وتوجيهات الرقية الشرعية والعلاج بالقرآن"}</h2>
        <p>
          {isTr
            ? "Ruqya Center blog sayfasında Kur'an-ı Kerim ve Sünnet ışığında manevi şifa, nazar, büyü ve ruhsal rahatsızlıklar hakkında detaylı rehberler ve uzman yazıları bulabilirsiniz."
            : "يقدم مركز الرقية الشرعية مجموعة متكاملة من المقالات العلمية والشرعية الموثوقة لتوعية المرضى والمستفيدين بأساليب الوقاية والعلاج بكلام الله تعالى وتطبيق السنة النبوية الشريفة."}
        </p>
      </div>
      {children}
    </>
  );
}
