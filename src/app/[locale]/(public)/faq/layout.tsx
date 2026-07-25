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
      <h1 className="sr-only">{isTr ? "Ruqya Center Sıkça Sorulan Sorular ve Şifa Rehberi" : "الأسئلة الشائعة والإجابات الشرعية المعتمدة لمركز الرقية"}</h1>
      <div className="sr-only">
        <h2>{isTr ? "Manevi Tedavi ve Danışmanlık Hakkında Sorular" : "إجابات شمولية وحلول شرعية لمختلف الأسئلة والاستفسارات"}</h2>
        <p>
          {isTr
            ? "Ruqya Center olarak manevi tedavi, Kur'an-ı Kerim ile şifa bulma, online danışmanlık seansları, randevu süreçleri ve manevi korunma zırhları hakkında kullanıcılarımızın en çok merak ettiği soruları ve detaylı yanıtlarını sizin için derledik."
            : "نقدم في هذا القسم إجابات وتوضيحات شرعية وتفصيلية عن أهم الأسئلة المتكررة حول أعراض الإصابة الروحية، طريقة تشخيص العين والحسد والسحر، وكيفية حجز المواعيد والاستفادة من الجلسات أونلاين بخصوصية تامة."}
        </p>
        <h3>{isTr ? "En Çok Sorulan Konular" : "أبرز المحاور والاستفسارات الشائعة"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Online rukye seansları nasıl gerçekleştirilir ve etkili midir?</li>
              <li>Ruqya seansı öncesinde nasıl bir hazırlık yapılmalıdır?</li>
              <li>Nazar ve büyü arasındaki temel farklar nelerdir?</li>
              <li>Randevu iptali veya tarih değişikliği nasıl yapılır?</li>
            </>
          ) : (
            <>
              <li>كيف تتم جلسات الرقية الشرعية عن بُعد عبر الإنترنت وهل هي مجدية؟</li>
              <li>ما هي الاستعدادات والخطوات الواجب اتباعها قبل بدء جلسة الرقية؟</li>
              <li>ما هو الفرق بين أعراض الحسد والعين والمس والسحر وطرق الوقاية منها؟</li>
              <li>كيفية حجز وتعديل المواعيد والتواصل المباشر مع الراقي المعالج؟</li>
            </>
          )}
        </ul>
      </div>
      {children}
    </>
  );
}
