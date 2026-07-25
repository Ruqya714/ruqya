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
    title: isTr ? "Gizlilik Politikası" : "سياسة الخصوصية",
    description: isTr
      ? "Ruqya Center kişisel verilerin korunması ve gizlilik politikası."
      : "سياسة الخصوصية وحماية بيانات المستفيدين والمرضى في مركز الرقية الشرعية.",
    alternates: getPageAlternates(locale, "/privacy-policy"),
  };
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
