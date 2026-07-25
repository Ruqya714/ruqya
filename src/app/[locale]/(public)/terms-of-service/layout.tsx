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
    title: isTr ? "Kullanım Şartları" : "شروط الاستخدام",
    description: isTr
      ? "Ruqya Center hizmet kullanım şartları ve yasal sözleşme."
      : "شروط وأحكام استخدام الاستشارات والخدمات في مركز الرقية الشرعية.",
    alternates: getPageAlternates(locale, "/terms-of-service"),
  };
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
