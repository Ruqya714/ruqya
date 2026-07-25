import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import { getBreadcrumbSchema } from "@/lib/jsonld";
import { getBaseUrl, getPageAlternates } from "@/lib/site-url";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isTr = locale === "tr";

  return {
    title: isTr ? "Randevu Al" : "حجز استشارة",
    description: isTr
      ? "Ruqya Center'dan uzmanlarımızla görüşmek için hemen randevu oluşturun."
      : "احجز موعد استشارة أو جلسة رقية شرعية مع أطبائنا ومعالجينا المعتمدين.",
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
        <h2>{isTr ? "Manevi Danışmanlık ve Rukye Randevu Süreci" : "خطوات حجز جلسة استشارية وعلاجية مع الراقي المعالج"}</h2>
        <p>
          {isTr
            ? "Ruqya Center üzerinden manevi danışmanlık, rukye tedavisi ve teşhis ses oturumları için kolayca randevu alabilirsiniz. Sistemimiz üzerinden seçeceğiniz uzman معالج, size özel uygun saat aralığında birebir canlı görüşme imkanı sunar. Randevu alırken durumunuzu detaylıca belirtebilir, geçmiş tedavi süreçlerinizi ve yaşadığınız semptomları aktarabilirsiniz. Tüm randevu bilgileriniz ve kişisel verileriniz gizlilik ilkelerimiz kapsamında koruma altındadır."
            : "يتيح لكم مركز الرقية بكلام الرحمن حجز جلسات استشارية وعلاجية مباشرة عبر الإنترنت أو في المركز المعتمد. يمكنك اختيار المعالج المختص وتحديد الموعد والوقت المناسب لجدولك الزمني. أثناء عملية الحجز، يُنصح بتوفير معلومات دقيقة حول الحالة والتقييم الذاتي لضمان تقديم أفضل خطة علاجية متكاملة تعتمد على الكتاب والسنة المطهرة مع التوجيه والنصح المستمر."}
        </p>
        <h3>{isTr ? "Randevu Öncesi Hazırlık ve Bilgilendirme" : "توجيهات وإرشادات مهمة قبل البدء بالجلسة العلاجية"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Randevu saatinden 10 dakika önce sakin bir ortamda hazır bulununuz.</li>
              <li>Kulaklık ve kararlı bir internet bağlantısı kullanılması tavsiye edilir.</li>
              <li>Seans sırasında yanınızda bir mahrem veya yakın bulunması önerilir.</li>
              <li>Uzman معالج tarafından verilen ön teşhis formunu eksiksiz doldurunuz.</li>
            </>
          ) : (
            <>
              <li>الاستعداد قبل موعد الجلسة بـ 10 دقائق في مكان هادئ ومناسب للاستماع.</li>
              <li>التأكد من جودة الاتصال بالإنترنت واستخدام سماعات أذن جيدة الصوت.</li>
              <li>يفضل حضور أحد الأقارب أو المحارم أثناء الجلسات العلاجية للنساء.</li>
              <li>إكمال نموذج التقييم المبدئي بدقة لمساعدة المعالج على تشخيص الحالة بشكل سليم.</li>
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
