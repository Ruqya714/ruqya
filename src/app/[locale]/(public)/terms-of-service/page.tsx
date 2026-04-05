"use client";

import { SITE_NAME } from "@/lib/constants";
import { Link } from "@/i18n/routing";
import { ArrowRight, FileText } from "lucide-react";
import { useLocale } from "next-intl";

export default function TermsOfServicePage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <>
      <section className="bg-primary/5 py-12 lg:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            {isAr ? "شروط الخدمة وسياسة العمل" : "Hizmet Şartları ve Çalışma Politikası"}
          </h1>
          <p className="text-text-secondary">
            {isAr ? "آخر تحديث:" : "Son güncelleme:"} {new Date().toLocaleDateString(isAr ? 'ar-EG' : 'tr-TR')}
          </p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-border p-8 lg:p-12 shadow-sm prose prose-slate prose-lg md:prose-xl max-w-none text-text-primary" dir={isAr ? "rtl" : "ltr"}>
            {isAr ? (
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
                <ul className="list-disc ps-6 space-y-2 text-text-secondary">
                  <li>في الجلسات الحضورية، يُشترط وجود <strong>مَحرَم</strong> لمرافقة الأخت المريضة.</li>
                  <li>في الجلسات عن بُعد، يُفضل وجود أحد أفراد الأسرة بالقرب من المريضة.</li>
                  <li>يُشترط الالتزام التام باللباس الشرعي المحتشم أثناء الجلسات.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">5. السلوك والآداب</h2>
                <p className="text-text-secondary leading-relaxed">
                  نحتفظ بالحق الكامل في إيقاف الجلسة أو إلغاء الحجز بشكل فوري في حال حدوث أي تجاوزات أخلاقية.
                </p>
                <div className="mt-12 pt-8 border-t border-border">
                  <p className="font-semibold text-text-primary mb-2">استفسارات؟</p>
                  <p className="text-text-secondary">إذا كان لديك أي أسئلة، لا تتردد في <Link href="/contact" className="text-primary hover:underline font-medium">التواصل معنا</Link>.</p>
                </div>
              </>
            ) : (
              <>
                <p className="lead text-text-secondary leading-relaxed mb-8">
                  {SITE_NAME || "Şer'i Rukye ve Danışmanlık Merkezi"}&apos;ne hoş geldiniz. Bu şartlar ve politikalar tüm hizmet faydalananlarımız için geçerlidir. Platformumuzu kullanmanız ve randevu almanız, bu şartları tam olarak kabul ettiğiniz anlamına gelir.
                </p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">1. Hizmetlerin Doğası ve Sorumluluk Reddi</h2>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>Merkezde sunulan şer&apos;i rukye ve danışmanlıklar <strong>Allah&apos;ın izniyle şifa için meşru sebepler</strong>dir. Sonuçları garanti etmiyoruz, şifa yalnızca Allah&apos;ın elindedir.</li>
                  <li>Hizmetlerimiz fiziksel veya psikolojik tıbbın <strong>yerini almaz ve ortadan kaldırmaz</strong>.</li>
                  <li>Merkezdeki rukye uzmanları Kur&apos;an-ı Kerim ve Sünnet-i Seniyye&apos;den doğru şer&apos;i yönteme bağlı kalır.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">2. Randevu ve Zamanlama Politikası</h2>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>Randevular yalnızca ödeme tamamlandıktan ve onay mesajı alındıktan sonra kesinleşir.</li>
                  <li>Randevuya 15 dakikadan fazla geç kalınması durumunda randevu iptal sayılır.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">3. İptal ve İade Politikası</h2>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>Randevu tarihinden en az <strong>24 saat</strong> önce iptal veya yeniden planlama hakkına sahipsiniz.</li>
                  <li>24 saatten az kala yapılan iptallerde ücret iadesi yapılmaz.</li>
                  <li>Danışmanlık veya seans tamamlandıktan sonra iade yapılmaz.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">4. Seans Kuralları (Hanımlar İçin)</h2>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>Yüz yüze seanslarda hasta hanıma <strong>mahrem</strong> eşlik etmesi zorunludur.</li>
                  <li>Uzaktan seanslarda, bir aile bireyinin hastanın yakınında bulunması tercih edilir.</li>
                  <li>Seanslar sırasında şer&apos;i tesettüre tam uyum zorunludur.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">5. Davranış ve Adab</h2>
                <p className="text-text-secondary leading-relaxed">
                  Herhangi bir ahlaki ihlal durumunda seansı durdurma veya randevuyu derhal iptal etme hakkımızı saklı tutarız.
                </p>
                <div className="mt-12 pt-8 border-t border-border">
                  <p className="font-semibold text-text-primary mb-2">Sorularınız mı var?</p>
                  <p className="text-text-secondary">Herhangi bir sorunuz varsa lütfen <Link href="/contact" className="text-primary hover:underline font-medium">bizimle iletişime geçin</Link>.</p>
                </div>
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
