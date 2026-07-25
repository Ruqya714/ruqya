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

export default async function FaqLayout({
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
        <h2>{isTr ? "Sıkça Sorulan Sorular ve Cevaplar" : "الأسئلة الشائعة والأجوبة الشرعية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center olarak manevi tedavi, Kuran ile şifa, online danışmanlık seansları ve randevu süreçleri hakkında en çok merak edilen soruları ve detaylı yanıtlarını sizin için derledik."
            : "نقدم إجابات وتوضيحات شرعية وتفصيلية عن أهم الأسئلة المتكررة حول أعراض الإصابة الروحية، طريقة تشخيص العين والحسد والسحر، وكيفية حجز المواعيد والاستفادة من الاستشارات أونلاين."}
        </p>
      </div>
      {children}
    </>
  );
}
