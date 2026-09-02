import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/jsonld";
import { getBaseUrl, getPageAlternates } from "@/lib/site-url";
import { getCmsPageSeo } from "@/lib/cms";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  const seo = await getCmsPageSeo("/booking", locale, {
    title: isTr ? "Randevu Al | Ruqya Center" : "سجّل حالتك واحجز موعد استشارة | مركز الرقية",
    description: isTr
      ? "Ruqya Center'dan uzmanlarımızla görüşmek için hemen randevu oluşturun."
      : "احجز موعد استشارة أو جلسة رقية شرعية مع أطبائنا ومعالجينا المعتمدين.",
  });

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords ? seo.keywords.split(",").map((k) => k.trim()) : undefined,
    openGraph: seo.og_image_url ? { images: [seo.og_image_url] } : undefined,
    alternates: getPageAlternates(locale, "/booking"),
  };
}

export default async function BookingLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/booking`;
  const trUrl = `${baseUrl}/tr/booking`;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "Randevu Al" : "حجز استشارة", url: isTr ? trUrl : arUrl },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {/* SSR SEO Title H1 & Rich Text for Crawlers with JS disabled */}
      <h1 className="sr-only">{isTr ? "Ruqya Center Online Randevu ve Uzman Danışmanlık Sistemi" : "حجز استشارة وتحديد مواعيد جلسات الرقية الشرعية المعتمدة"}</h1>
      <div className="sr-only">
        <h2>{isTr ? "Manevi Danışmanlık ve Rukye Randevu Süreci Detaylı Bilgilendirme" : "خطوات حجز جلسة استشارية وعلاجية مع الراقي المعالج المعتمد"}</h2>
        <p>
          {isTr
            ? "Ruqya Center üzerinden manevi danışmanlık, rukye tedavisi ve teşhis ses oturumları için kolayca randevu alabilirsiniz. Sistemimiz üzerinden seçeceğiniz uzman معالج, size özel uygun saat aralığında birebir canlı görüşme imkanı sunar. Randevu alırken durumunuzu detaylıca belirtebilir, geçmiş tedavi süreçlerinizi ve yaşadığınız semptomları aktarabilirsiniz. Tüm randevu bilgileriniz ve kişisel verileriniz gizlilik ilkelerimiz kapsamında koruma altındadır."
            : "يتيح لكم مركز الرقية بكلام الرحمن حجز جلسات استشارية وعلاجية مباشرة عبر الإنترنت أو في المركز المعتمد. يمكنك اختيار المعالج المختص وتحديد الموعد والوقت المناسب لجدولك الزمني. أثناء عملية الحجز، يُنصح بتوفير معلومات دقيقة حول الحالة والتقييم الذاتي لضمان تقديم أفضل خطة علاجية متكاملة تعتمد على الكتاب والسنة المطهرة مع التوجيه والنصح المستمر."}
        </p>
        <p>
          {isTr
            ? "Danışmanlık seansı boyunca uzmanlarımız sizi dinler, manevi durum değerlendirmesini yapar ve Kur'an-ı Kerim ayetleri ile rukye programı hazırlar. Seans sonrasında yapılması gereken zikirler ve okunacak dualar detaylı olarak tarafınıza iletilir."
            : "خلال الجلسة الاستشارية، يستمع المعالج إلى تفاصيل الحالة بدقة، ويجري التقييم الشرعي للأعراض، ثم يضع برنامجا علاجيا مكثفاً يشمل أذكار الرقية والتلاوات اليومية الموصى بها."}
        </p>
        <h3>{isTr ? "Randevu Öncesi Hazırlık ve Bilgilendirme Adımları" : "توجيهات وإرشادات مهمة قبل البدء بالجلسة العلاجية"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Randevu saatinden 10 dakika önce sakin bir ortamda hazır bulununuz.</li>
              <li>Kulaklık ve kararlı bir internet bağlantısı kullanılması tavsiye edilir.</li>
              <li>Seans sırasında yanınızda bir mahrem veya yakın bulunması önerilir.</li>
              <li>Uzman معالج tarafından verilen ön teşhis formunu eksiksiz doldurunuz.</li>
              <li>Seans öncesinde abdest alıp manevi olarak odaklanmanız faydalı olacaktır.</li>
            </>
          ) : (
            <>
              <li>التواجد قبل موعد الجلسة بـ 10 دقائق في مكان هادئ وخالٍ من المشتتات.</li>
              <li>استخدام سماعات أذن جيدة وتوفر اتصال إنترنت ثابت ومباشر.</li>
              <li>يُفضل وجود محرم أو مرافق أثناء عقد الجلسة للحالات الأسرية.</li>
              <li>تعبئة استمارة التقييم الأولي بدقة لمساعدة المعالج في التشخيص.</li>
              <li>الوضوء والاستعداد النفسي والروحي قبل التحدث مع المعالج.</li>
            </>
          )}
        </ul>
        <h3>{isTr ? "Gizlilik Güvencesi ve İletişim Desteği" : "الخصوصية التامة والدعم الفني المباشر"}</h3>
        <p>
          {isTr
            ? "Tüm sesli ve görüntülü randevular yüksek güvenlik standartlarında gerçekleştirilir. Randevu iptali veya tarih değişikliği için randevu saatinden 24 saat önce destek ekibimizle iletişime geçebilirsiniz."
            : "نلتزم في مركز الرقية بأعلى معايير الخصوصية والسرية التامة لكافة بيانات المرضى والمستفيدين. في حال الحاجة لتعديل أو تغيير موعد الجلسة، يمكنكم التواصل مع فريق الدعم الفني قبل الموعد بـ 24 ساعة."}
        </p>
      </div>
      {children}
    </>
  );
}
