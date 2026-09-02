import type { Metadata } from "next";
import { getPageAlternates } from "@/lib/site-url";
import { getCmsPageSeo } from "@/lib/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const seo = await getCmsPageSeo("/faq", locale, {
    title: isTr ? "Sıkça Sorulan Sorular | Ruqya Center" : "الأسئلة الشائعة حول الرقية والعلاج | مركز الرقية",
    description: isTr
      ? "Ruqya, manevi tedavi ve danışmanlık hakkında merak edilen tüm sorular."
      : "إجابات شمولية وموثوقة على كافة الأسئلة الشائعة حول الرقية الشرعية وأعراض العين والحسد والسحر.",
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: seo.og_image_url ? { images: [seo.og_image_url] } : undefined,
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
      <h2 className="sr-only">{isTr ? "Ruqya Center Sıkça Sorulan Sorular ve Şifa Rehberi" : "الأسئلة الشائعة والإجابات الشرعية المعتمدة لمركز الرقية بكلام الرحمن"}</h2>
      <div className="sr-only">
        <h2>{isTr ? "Manevi Tedavi ve Danışmanlık Hakkında Detaylı Rehber" : "إجابات شمولية وحلول شرعية لمختلف الأسئلة والاستفسارات العلاجية"}</h2>
        <p>
          {isTr
            ? "Ruqya Center olarak manevi tedavi, Kur'an-ı Kerim ile şifa bulma, online danışmanlık seansları, randevu süreçleri ve manevi korunma zırhları hakkında kullanıcılarımızın en çok merak ettiği soruları ve detaylı yanıtlarını sizin için derledik. Sorularınız uzman kadromuz ve معالج ekibimiz tarafından شرعي ilkeler çerçevesinde yanıtlanmıştır."
            : "نقدم في هذا القسم إجابات وتوضيحات شرعية وتفصيلية عن أهم الأسئلة المتكررة حول أعراض الإصابة الروحية، طريقة تشخيص العين والحسد والسحر، وكيفية حجز المواعيد والاستفادة من الجلسات أونلاين بخصوصية تامة مع نخبة من الرقاة المعالجين المعتمدين في المركز."}
        </p>
        <h3>{isTr ? "En Çok Sorulan Konular ve Sorular" : "أبرز المحاور والاستفسارات الشائعة إجاباتها"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Online rukye seansları nasıl gerçekleştirilir ve etkili midir? Evet, görüntülü veya sesli canlı seanslar aynı manevi etkiye sahiptir.</li>
              <li>Ruqya seansı öncesinde nasıl bir hazırlık yapılmalıdır? Abdestli bulunmak, sakin bir ortam sağlamak ve kulaklık kullanmak önerilir.</li>
              <li>Nazar ve büyü arasındaki temel farklar nelerdir? Teşhis seansında belirtiler uzman معالج tarafından detaylıca ayırt edilir.</li>
              <li>Randevu iptali veya tarih değişikliği nasıl yapılır? Destek ekibimizle 24 saat önceden iletişime geçerek kolayca randevu saatinizi değiştirebilirsiniz.</li>
              <li>Rukye seansı ne kadar sürer? Birebir seanslar durumun ihtiyacına göre ortalama 30 ile 60 dakika arasında tamamlanır.</li>
            </>
          ) : (
            <>
              <li>كيف تتم جلسات الرقية الشرعية عن بُعد عبر الإنترنت وهل هي مجدية؟ نعم، يتم عقد الجلسة مباشرة بالصوت والصورة وتكون ذات تأثير قوي بإذن الله.</li>
              <li>ما هي الاستعدادات والخطوات الواجب اتباعها قبل بدء جلسة الرقية؟ الطهارة والوضوء، الاستقرار في مكان هادئ، واستخدام سماعات أذن واضحة الصوت.</li>
              <li>ما هو الفرق بين أعراض الحسد والعين والمس والسحر وطرق الوقاية منها؟ يتم تحديد الفروق بدقة خلال جلسة التشخيص المباشرة مع الراقي المعالج.</li>
              <li>كيفية حجز وتعديل المواعيد والتواصل المباشر مع الراقي المعالج؟ يمكن تعديل الموعد بالتواصل مع فريق الدعم الفني قبل 24 ساعة من الجلسة.</li>
              <li>كم تبلغ مدة الجلسة العلاجية؟ تستغرق الجلسة المباشرة بين 30 إلى 60 دقيقة بحسب احتياج الحالة وتقييم المعالج.</li>
            </>
          )}
        </ul>
      </div>
      {children}
    </>
  );
}
