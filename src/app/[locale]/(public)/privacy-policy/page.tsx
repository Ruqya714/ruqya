"use client";

import { SITE_NAME } from "@/lib/constants";
import { Link } from "@/i18n/routing";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function PrivacyPolicyPage() {
  const locale = useLocale();
  const isAr = locale === "ar";

  return (
    <>
      <section className="bg-primary/5 py-12 lg:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">
            {isAr ? "سياسة الخصوصية" : "Gizlilik Politikası"}
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
                  في {SITE_NAME || "مركز الرقية الشرعية والاستشارات"}، نضع خصوصية المرضى والمستفيدين في أعلى درجات الأهمية. نحن ندرك تماماً حساسية المعلومات التي يتم مشاركتها معنا، ونلتزم التزاماً كاملاً بحمايتها وفقاً لأعلى معايير السرية والأمان.
                </p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">1. سرية المعلومات والبيانات</h2>
                <ul className="list-disc ps-6 space-y-2 text-text-secondary">
                  <li>جميع المعلومات الشخصية والتفاصيل الخاصة بالحالات والأعراض التي يتم تقديمها عبر الموقع أو أثناء الجلسات (سواء الحضورية أو عن بُعد) تُعتبر سرية للغاية.</li>
                  <li>لا يتم مشاركة، أو بيع، أو تأجير أي بيانات شخصية (مثل الاسم، رقم الهاتف، البريد الإلكتروني، أو تفاصيل الحالة) لأي طرف ثالث تحت أي ظرف من الظروف.</li>
                  <li>الوصول إلى سجلات المستفيدين مقتصر فقط على الرقاة والمعالجين المختصين والمصرح لهم بمتابعة الحالة.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">2. جمع واستخدام البيانات</h2>
                <p className="text-text-secondary leading-relaxed mb-4">نحن نجمع البيانات الضرورية فقط التي تمكننا من تقديم خدماتنا بأفضل شكل ممكن، وتشمل:</p>
                <ul className="list-disc ps-6 space-y-2 text-text-secondary">
                  <li>البيانات الأساسية للتواصل وتأكيد الحجوزات.</li>
                  <li>المعلومات المطلوبة للتشخيص المبدئي لتحديد نوع الاستشارة أو الجلسة المناسبة للحالة.</li>
                  <li>التاريخ المرضي والأعراض السابقة لضمان جودة وتكامل الخطة العلاجية.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">3. أمان المدفوعات</h2>
                <p className="text-text-secondary leading-relaxed">جميع عمليات الدفع الإلكتروني تتم عبر بوابات دفع آمنة ومعتمدة. نحن لا نقوم بتخزين تفاصيل بطاقات الائتمان أو أي بيانات بنكية دقيقة على خوادمنا.</p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">4. التعديل على سياسة الخصوصية</h2>
                <p className="text-text-secondary leading-relaxed">نحتفظ بالحق في تعديل سياسة الخصوصية هذه لتتوافق مع أي تغييرات في طبيعة خدماتنا أو للامتثال للقوانين المعمول بها.</p>
                <div className="mt-12 pt-8 border-t border-border">
                  <p className="font-semibold text-text-primary mb-2">تواصل معنا</p>
                  <p className="text-text-secondary">إذا كان لديك أي استفسارات بشأن سياسة الخصوصية، يرجى التواصل معنا عبر <Link href="/contact" className="text-primary hover:underline font-medium">صفحة اتصل بنا</Link>.</p>
                </div>
              </>
            ) : (
              <>
                <p className="lead text-text-secondary leading-relaxed mb-8">
                  {SITE_NAME || "Şer'i Rukye ve Danışmanlık Merkezi"} olarak hastaların ve faydalananların gizliliğini en yüksek öncelikle ele alıyoruz. Bizimle paylaşılan bilgilerin hassasiyetinin tamamen farkındayız ve en yüksek gizlilik ve güvenlik standartlarına uygun şekilde korumayı taahhüt ediyoruz.
                </p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">1. Bilgi ve Veri Gizliliği</h2>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>Web sitesi üzerinden veya seanslar sırasında (yüz yüze veya uzaktan) sağlanan tüm kişisel bilgiler, vaka detayları ve belirtiler son derece gizli kabul edilir.</li>
                  <li>Hiçbir kişisel veri (ad, telefon numarası, e-posta veya vaka detayları) hiçbir koşulda üçüncü taraflarla paylaşılmaz, satılmaz veya kiralanmaz.</li>
                  <li>Faydalanan kayıtlarına erişim yalnızca vakayı takip etmeye yetkili uzman rukye terapistleri ve tedavcilerle sınırlıdır.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">2. Veri Toplama ve Kullanımı</h2>
                <p className="text-text-secondary leading-relaxed mb-4">Hizmetlerimizi en iyi şekilde sunmamızı sağlayan yalnızca gerekli verileri topluyoruz:</p>
                <ul className="list-disc pe-6 space-y-2 text-text-secondary">
                  <li>İletişim ve randevu onayı için temel veriler.</li>
                  <li>Uygun danışmanlık veya seans türünü belirlemek için ön teşhis bilgileri.</li>
                  <li>Tedavi planının kalitesini ve bütünlüğünü sağlamak için tıbbi geçmiş ve önceki belirtiler.</li>
                </ul>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">3. Ödeme Güvenliği</h2>
                <p className="text-text-secondary leading-relaxed">Tüm elektronik ödemeler güvenli ve onaylı ödeme ağ geçitleri üzerinden gerçekleştirilir. Kredi kartı detaylarını veya hassas bankacılık verilerini sunucularımızda saklamıyoruz.</p>
                <h2 className="text-xl font-bold text-primary mt-8 mb-4">4. Gizlilik Politikası Değişiklikleri</h2>
                <p className="text-text-secondary leading-relaxed">Hizmetlerimizdeki değişikliklere veya yürürlükteki yasalara uyum sağlamak için bu gizlilik politikasını değiştirme hakkımızı saklı tutarız.</p>
                <div className="mt-12 pt-8 border-t border-border">
                  <p className="font-semibold text-text-primary mb-2">Bize Ulaşın</p>
                  <p className="text-text-secondary">Gizlilik politikası hakkında sorularınız varsa, lütfen <Link href="/contact" className="text-primary hover:underline font-medium">İletişim sayfamız</Link> üzerinden bizimle iletişime geçin.</p>
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
