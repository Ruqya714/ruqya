import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight, FileText } from "lucide-react";

export const metadata = {
  title: "شروط الخدمة وسياسة العمل",
  description: "شروط وضوابط الحصول على خدمات مركز الرقية الشرعية.",
};

export default function TermsOfServicePage() {
  return (
    <>
      <section className="bg-primary/5 py-12 lg:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">شروط الخدمة وسياسة العمل</h1>
          <p className="text-text-secondary">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-border p-8 lg:p-12 shadow-sm prose prose-slate prose-lg md:prose-xl max-w-none text-text-primary" dir="rtl">
            <p className="lead text-text-secondary leading-relaxed mb-8">
              مرحباً بك في {SITE_NAME || "مركز الرقية الشرعية والاستشارات"}. 
              تسري هذه الشروط والسياسات على جميع المستفيدين من خدماتنا (عبر الموقع الإلكتروني، الاستشارات المكتوبة والصوتية، والجلسات بجميع أنواعها). استخدامك للمنصة وحجزك للمواعيد يعني موافقتك الكاملة على هذه الشروط.
            </p>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">1. طبيعة الخدمات وإخلاء المسؤولية</h2>
            <ul className="list-disc pr-6 space-y-2 text-text-secondary">
              <li>الرقية الشرعية والاستشارات المقدمة في المركز هي <strong>أسباب شرعية للشفاء بإذن الله</strong>. نحن لا نضمن النتائج، فالشفاء بيد الله وحده.</li>
              <li>خدماتنا <strong>لا تُغني ولا تلغي</strong> دور الطب العضوي أو النفسي. إذا كنت تعاني من أمراض عضوية أو نفسية مشخصة طبياً، يُنصح بشدة بالاستمرار في متابعة طبيبك المختص جنباً إلى جنب مع برنامج الرقية.</li>
              <li>يلتزم الرقاة في المركز بالمنهج الشرعي الصحيح من القرآن الكريم والسنة النبوية، بعيداً عن أي ممارسات مخالفة أو بدع.</li>
            </ul>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">2. سياسة الحجز والمواعيد</h2>
            <ul className="list-disc pr-6 space-y-2 text-text-secondary">
              <li>يتم تأكيد المواعيد (للاستشارات أو الجلسات) فقط بعد إتمام عملية الدفع (إن وُجدت) واستلام رسالة التأكيد.</li>
              <li>في حال التأخر عن موعد الاستشارة الصوتية أو الجلسة عن بُعد لأكثر من 15 دقيقة، يُعتبر الموعد مُلغى ولا يحق للمستفيد المطالبة بالوقت الضائع.</li>
            </ul>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">3. سياسة الإلغاء والاسترجاع</h2>
            <ul className="list-disc pr-6 space-y-2 text-text-secondary">
              <li>يحق للمستفيد إلغاء أو إعادة جدولة الموعد قبل <strong>24 ساعة</strong> على الأقل من وقت الموعد المحدد، ويتم استرجاع المبلغ كاملاً أو تحويله لموعد آخر.</li>
              <li>في حال الإلغاء قبل الموعد بأقل من 24 ساعة، لا يتم استرجاع المبلغ نظراً لحجز الوقت المخصص للمستفيد وعدم إمكانية منحه لمستفيد آخر.</li>
              <li>لا يتم استرجاع المبالغ بعد إتمام الاستشارة أو الجلسة.</li>
            </ul>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">4. ضوابط الجلسات (للأخوات)</h2>
            <ul className="list-disc pr-6 space-y-2 text-text-secondary">
              <li>في الجلسات الحضورية، يُشترط وجود <strong>مَحرَم</strong> لمرافقة الأخت المريضة.</li>
              <li>في الجلسات عن بُعد، يُفضل وجود أحد أفراد الأسرة بالقرب من المريضة لضمان متابعة الحالة إذا دعت الحاجة.</li>
              <li>يُشترط الالتزام التام باللباس الشرعي المحتشم أثناء الجلسات (سواء الحضورية أو عن بُعد إذا تطلب الأمر فتح الكاميرا للتشخيص المبدئي بناءً على طلب المعالج وموافقة المستفيدة).</li>
            </ul>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">5. السلوك والآداب</h2>
            <p className="text-text-secondary leading-relaxed">
              نحتفظ بالحق الكامل في إيقاف الجلسة أو إلغاء الحجز بشكل فوري (دون استرجاع الرسوم) في حال حدوث أي تجاوزات أخلاقية، إساءة لفظية للمعالج، أو عدم الالتزام بالآداب العامة والضوابط الشرعية أثناء التواصل.
            </p>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="font-semibold text-text-primary mb-2">استفسارات؟</p>
              <p className="text-text-secondary">
                إذا كان لديك أي أسئلة حول شروط الخدمة، لا تتردد في <Link href="/contact" className="text-primary hover:underline font-medium">التواصل معنا</Link>.
              </p>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-medium transition-colors">
              <ArrowRight size={16} />
              العودة للصفحة الرئيسية
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
