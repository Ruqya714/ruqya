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

export default async function PrivacyLayout({
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
        <h2>{isTr ? "Kişisel Verilerin Korunması ve Gizlilik" : "سياسة الخصوصية والسرية التامة لبيانات المرضى"}</h2>
        <p>
          {isTr
            ? "Ruqya Center olarak hastalarımızın ve danışanlarımızın özel hayatının gizliliğine ve kişisel verilerinin korunmasına büyük önem veriyoruz. Tüm görüşmeler ve kayıtlar son derece gizli tutulmaktadır."
            : "نلتزم التزاماً كاملاً بحماية خصوصية كافة المرضى والمستفيدين من خدمات مركز الرقية الشرعية، مع ضمان السرية التامة للبيانات والمعلومات والمحاضر التشخيصية وعدم مشاركتها مع أي طرف."}
        </p>
      </div>
      {children}
    </>
  );
}
