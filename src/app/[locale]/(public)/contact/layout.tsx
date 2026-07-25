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
    title: isTr ? "İletişim" : "اتصل بنا",
    description: isTr
      ? "Ruqya Center iletişim bilgileri, adresimiz ve destek hattımız."
      : "تواصل مع مركز الرقية الشرعية في إسطنبول عبر الهاتف، الواتساب، أو الاستمارة المباشرة.",
    alternates: getPageAlternates(locale, "/contact"),
  };
}

export default async function ContactLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isTr = locale === "tr";
  const baseUrl = getBaseUrl();
  const arUrl = `${baseUrl}/contact`;
  const trUrl = `${baseUrl}/tr/contact`;

  const breadcrumbSchema = getBreadcrumbSchema([
    { name: isTr ? "Ana Sayfa" : "الرئيسية", url: isTr ? `${baseUrl}/tr` : baseUrl },
    { name: isTr ? "İletişim" : "اتصل بنا", url: isTr ? trUrl : arUrl },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {/* Hidden SSR SEO text for crawlers with JS disabled */}
      <h1 className="sr-only">{isTr ? "Ruqya Center İletişim ve Destek Merkezi" : "التواصل المباشر والاستفسارات مع مركز الرقية الشرعية"}</h1>
      <div className="sr-only">
        <h2>{isTr ? "Ruqya Center İletişim Bilgileri ve Destek Channels" : "طرق التواصل المباشرة ومواعيد العمل في مركز الرقية بكلام الرحمن"}</h2>
        <p>
          {isTr
            ? "Ruqya Center ile iletişime geçin. Uzman معالج kadromuzla doğrudan görüşmek, randevu oluşturmak, konum ve adres bilgisi almak veya manevi danışmanlık hizmetleri hakkında bilgi edinmek için iletişim kanallarımız 7/24 hizmetinizdedir. WhatsApp destek hattımız, e-posta adresimiz ve direkt telefon numaramız üzerinden bize dilediğiniz zaman ulaşabilirsiniz."
            : "يسعدنا تواصلكم المباشر مع مركز الرقية بكلام الرحمن في إسطنبول للاستفسار عن العلاج والمواعيد ومتابعة الحالات المرضية. يوفر المركز قنوات تواصل متعددة تشمل الهاتف المباشر، الواتساب الرسمي، والبريد الإلكتروني، بالإضافة إلى زيارة المركز الميدانية وفق أوقات الدوام المحددة."}
        </p>
        <h3>{isTr ? "Çalışma Saatleri ve İletişim Detayları" : "ساعات العمل الرسمية وبيانات التواصل"}</h3>
        <ul>
          {isTr ? (
            <>
              <li>Telefon & WhatsApp: +90 537 859 88 50</li>
              <li>E-posta: info@ruqyacenter.com</li>
              <li>Çalışma Saatleri: Haftanın 7 günü 09:00 - 21:00 arası açık.</li>
              <li>Konum: İstanbul, Türkiye (Randevu ile ziyaret kabul edilmektedir).</li>
            </>
          ) : (
            <>
              <li>الهاتف والواتساب المباشر: 905378598850+</li>
              <li>البريد الإلكتروني الرسمي: info@ruqyacenter.com</li>
              <li>ساعات العمل: طوال أيام الأسبوع من الساعة 9:00 صباحاً حتى 9:00 مساءً.</li>
              <li>الموقع الجغرافي: إسطنبول، التركية (نستقبل الزيارات بموعد مسبق).</li>
            </>
          )}
        </ul>
        <h3>{isTr ? "Sıkça Sorulan İletişim Soruları" : "استفسارات التواصل الشائعة"}</h3>
        <p>
          {isTr
            ? "Randevu almadan önce durumunuzla ilgili ön bilgi almak isterseniz WhatsApp hattımız üzerinden uzmanlarımıza mesaj gönderebilirsiniz. Mesajlarınız en kısa sürede değerlendirilerek dönüş sağlanacaktır."
            : "إذا كان لديكم أي استفسار عاجل قبل حجز الموعد، يمكنكم كتابة حالتكم باختصار عبر الواتساب وسيقوم الفريق الطبي والاستشاري بالرد عليكم وتوجيهكم للخطوة المناسبة."}
        </p>
      </div>
      {children}
    </>
  );
}
