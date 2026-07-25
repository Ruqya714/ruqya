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
    title: isTr ? "Sıkça Sorulan Sorular" : "الأسئلة الشائعة",
    description: isTr
      ? "Ruqya, manevi tedavi ve danışmanlık hakkında merak edilen tüm sorular."
      : "إجابات شمولية وموثوقة على كافة الأسئلة الشائعة حول الرقية الشرعية وأعراض العين والحسد والسحر.",
    alternates: getPageAlternates(locale, "/faq"),
  };
}

export default function FaqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
