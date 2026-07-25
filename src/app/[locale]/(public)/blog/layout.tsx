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
      ? "Ruqya Center manevi şifa, Kuran ve sünnet ışığında rehber مقال لار."
      : "مقالات شرعية وعلمية موثوقة حول التحصين اليومي، أذكار الصباح والمساء، والعلاج بالقرآن.",
    alternates: getPageAlternates(locale, "/blog"),
  };
}

export default function BlogListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
