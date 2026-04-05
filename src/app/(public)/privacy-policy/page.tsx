import { SITE_NAME } from "@/lib/constants";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "سياسة الخصوصية",
  description: "سياسة الخصوصية وحماية البيانات في مركز الرقية الشرعية.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <section className="bg-primary/5 py-12 lg:py-16 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary mb-4">سياسة الخصوصية</h1>
          <p className="text-text-secondary">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
        </div>
      </section>

      <section className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl border border-border p-8 lg:p-12 shadow-sm prose prose-slate prose-lg md:prose-xl max-w-none text-text-primary" dir="rtl">
            <p className="lead text-text-secondary leading-relaxed mb-8">
              في {SITE_NAME || "مركز الرقية الشرعية والاستشارات"}، نضع خصوصية المرضى والمستفيدين في أعلى درجات الأهمية. نحن ندرك تماماً حساسية المعلومات التي يتم مشاركتها معنا، ونلتزم التزاماً كاملاً بحمايتها وفقاً لأعلى معايير السرية والأمان.
            </p>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">1. سرية المعلومات والبيانات</h2>
            <ul className="list-disc pr-6 space-y-2 text-text-secondary">
              <li>جميع المعلومات الشخصية والتفاصيل الخاصة بالحالات والأعراض التي يتم تقديمها عبر الموقع أو أثناء الجلسات (سواء الحضورية أو عن بُعد) تُعتبر سرية للغاية.</li>
              <li>لا يتم مشاركة، أو بيع، أو تأجير أي بيانات شخصية (مثل الاسم، رقم الهاتف، البريد الإلكتروني، أو تفاصيل الحالة) لأي طرف ثالث تحت أي ظرف من الظروف.</li>
              <li>الوصول إلى سجلات المستفيدين مقتصر فقط على الرقاة والمعالجين المختصين والمصرح لهم بمتابعة الحالة.</li>
            </ul>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">2. جمع واستخدام البيانات</h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              نحن نجمع البيانات الضرورية فقط التي تمكننا من تقديم خدماتنا بأفضل شكل ممكن، وتشمل:
            </p>
            <ul className="list-disc pr-6 space-y-2 text-text-secondary">
              <li>البيانات الأساسية للتواصل وتأكيد الحجوزات.</li>
              <li>المعلومات المطلوبة للتشخيص المبدئي لتحديد نوع الاستشارة أو الجلسة المناسبة للحالة.</li>
              <li>التاريخ المرضي والأعراض السابقة لضمان جودة وتكامل الخطة العلاجية.</li>
            </ul>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">3. أمان المدفوعات</h2>
            <p className="text-text-secondary leading-relaxed">
              جميع عمليات الدفع الإلكتروني تتم عبر بوابات دفع آمنة ومعتمدة. نحن لا نقوم بتخزين تفاصيل بطاقات الائتمان أو أي بيانات بنكية دقيقة على خوادمنا.
            </p>

            <h2 className="text-xl font-bold text-primary mt-8 mb-4">4. التعديل على سياسة الخصوصية</h2>
            <p className="text-text-secondary leading-relaxed">
              نحتفظ بالحق في تعديل سياسة الخصوصية هذه لتتوافق مع أي تغييرات في طبيعة خدماتنا أو للامتثال للقوانين المعمول بها. سيتم نشر أي تغييرات على هذه الصفحة وتحديث تاريخ "آخر تحديث" في الأعلى.
            </p>

            <div className="mt-12 pt-8 border-t border-border">
              <p className="font-semibold text-text-primary mb-2">تواصل معنا</p>
              <p className="text-text-secondary">
                إذا كان لديك أي استفسارات أو مخاوف بشأن سياسة الخصوصية أو كيفية تعاملنا مع بياناتك، يرجى التواصل معنا عبر <Link href="/contact" className="text-primary hover:underline font-medium">صفحة اتصل بنا</Link>.
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
