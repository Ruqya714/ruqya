import { SITE_NAME } from "@/lib/constants";
import { Link } from "@/i18n/routing";
import { ArrowRight, FileText } from "lucide-react";
import { getCmsContent } from "@/lib/cms";

export default async function TermsOfServicePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isAr = locale === "ar";

  const content = await getCmsContent("terms_of_service", "content", locale, {
    title: isAr ? "شروط الخدمة وسياسة العمل" : "Hizmet Şartları ve Çalışma Politikası",
    body: "",
  });

  return (
    <>
      <section className="bg-primary/5 py-12 lg:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            {content.title || (isAr ? "شروط الخدمة وسياسة العمل" : "Hizmet Şartları ve Çalışma Politikası")}
          </h1>
          <p className="text-text-secondary">
            {isAr ? "آخر تحديث:" : "Son güncelleme:"} {new Date().toLocaleDateString(isAr ? 'ar-EG' : 'tr-TR')}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-border p-8 lg:p-12 shadow-sm prose prose-slate prose-lg md:prose-xl max-w-none text-text-primary" dir={isAr ? "rtl" : "ltr"}>
            {content.body ? (
              <div className="whitespace-pre-line leading-relaxed text-text-secondary">
                {content.body}
              </div>
            ) : isAr ? (
              <>
                <p className="lead text-text-secondary leading-relaxed mb-8">
                  مرحباً بك في {SITE_NAME || "مركز الرقية الشرعية والاستشارات"}. 
                  تسري هذه الشروط والسياسات على جميع المستفيدين من خدماتنا. استخدامك للمنصة وحجزك للمواعيد يعني موافقتك الكاملة على هذه الشروط.
                </p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">1. طبيعة الخدمات وإخلاء المسؤولية</h2>
                <ul className="list-disc ps-6 space-y-2 text-text-secondary">
                  <li>الرقية الشرعية والاستشارات المقدمة في المركز هي <strong>أسباب شرعية للشفاء بإذن الله</strong>. نحن لا نضمن النتائج، فالشفاء بيد الله وحده.</li>
                  <li>خدماتنا <strong>لا تُغني ولا تلغي</strong> دور الطب العضوي أو النفسي.</li>
                  <li>يلتزم الرقاة في المركز بالمنهج الشرعي الصحيح من القرآن الكريم والسنة النبوية.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">2. سياسة الحجز والمواعيد</h2>
                <ul className="list-disc ps-6 space-y-2 text-text-secondary">
                  <li>يتم تأكيد المواعيد فقط بعد إتمام عملية الدفع واستلام رسالة التأكيد.</li>
                  <li>في حال التأخر عن الموعد لأكثر من 15 دقيقة، يُعتبر الموعد مُلغى.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">3. سياسة الإلغاء والاسترجاع</h2>
                <ul className="list-disc ps-6 space-y-2 text-text-secondary">
                  <li>يحق للمستفيد إلغاء أو إعادة جدولة الموعد قبل <strong>24 ساعة</strong> على الأقل.</li>
                  <li>في حال الإلغاء قبل الموعد بأقل من 24 ساعة، لا يتم استرجاع المبلغ.</li>
                  <li>لا يتم استرجاع المبالغ بعد إتمام الاستشارة أو الجلسة.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">4. ضوابط الجلسات (للأخوات)</h2>
                <p className="text-sm font-medium text-red-600 mb-2 bg-red-50 p-3 rounded border border-red-100">تنبيه هام: بدون وجود مَحرم لا يمكن للنساء التواصل معنا أو حجز استشارة أو جلسة (سواء حضورية أو عن بعد).</p>
                <ul className="list-disc ps-6 space-y-2 text-text-secondary">
                  <li>في الجلسات الحضورية، يُشترط حضور <strong>مَحرَم</strong> لمرافقة الأخت المريضة طوال فترة الجلسة.</li>
                  <li>في الجلسات عن بُعد، يُشترط أيضاً حضور مَحرم بالقرب من المريضة.</li>
                  <li>يُشترط الالتزام التام باللباس الشرعي المحتشم أثناء جميع الجلسات.</li>
                </ul>
              </>
            ) : (
              <>
                <p className="lead text-text-secondary leading-relaxed mb-8">
                  {SITE_NAME || "Şer'i Rukye ve Danışmanlık Merkezi"}ne hoş geldiniz. 
                  Bu şartlar ve politikalar hizmetlerimizden yararlanan tüm danışanlar için geçerlidir.
                </p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">1. Hizmetlerin Niteliği</h2>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>Merkezde sunulan rukye ve danışmanlık hizmetleri manevi şifa vesileleridir. Şifa yalnızca Allah'tandır.</li>
                  <li>Hizmetlerimiz tıbbi veya psikiyatrik tedavinin yerini tutmaz.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">2. Randevu ve İptal Politikası</h2>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>Randevular randevu saatinden en az 24 saat önce iptal edilebilir veya ertelenebilir.</li>
                  <li>24 saatten az kalan iptallerde ücret iadesi yapılmamaktadır.</li>
                </ul>
              </>
            )}
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors">
              <ArrowRight size={16} />
              {isAr ? "العودة للصفحة الرئيسية" : "Ana Sayfaya Dön"}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
