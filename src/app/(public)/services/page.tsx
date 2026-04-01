import type { Metadata } from "next";
import Link from "next/link";
import { Phone, BookOpen, Heart, Star, Clock, ArrowLeft, CheckCircle, ShieldAlert, Sparkles, UserCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "الخدمات العلاجية",
  description: "اطلع على خدمات العلاج بالرقية الشرعية، تبدأ كل رحلة علاجية لدينا بجلسة استشارة تقييمية مفصلة.",
};

const servicesList = [
  {
    icon: <BookOpen size={28} />,
    title: "التشخيص بالرقية",
    desc: "جلسة متخصصة لقراءة الرقية ومراقبة الأعراض لتحديد نوع الإصابة بدقة عالية (روحية، نفسية، جسدية).",
    features: [
      "قراءة رقية متخصصة لحالتك",
      "تحديد نوع الإصابة بشكل دقيق",
      "البدء في تسليم العلاج الملائم",
    ],
    gradient: "from-accent to-accent-dark",
  },
  {
    icon: <Heart size={28} />,
    title: "العلاج بإشراف خاص",
    desc: "برنامج علاجي مخصص للتعامل مع الحالات المستعصية يتضمن استخراج العقد وجلسات الرقية المباشرة مع دعم مستمر.",
    features: [
      "الاتصال المباشر على مدار الساعة",
      "تأمين الأدوية والعلاجات دون قيود",
      "جلسات علاجية ورقية دون قيود",
      "المتابعة اليومية والتقييم الدوري",
      "تحديث مستمر للخطة العلاجية",
      "ضمان استمرار المعالج حتى التخلص التام",
      "الدعم النفسي والمعنوي غير المحدود",
      "استشارات شرعية وطبية دمجاً للعلاج",
      "المتابعة بعد الشفاء بشهرين (للتحصين)",
      "لا يتم دون إجراء تشخيص دقيق مسبق"
    ],
    gradient: "from-teal-dark to-primary-dark",
  },
  {
    icon: <Star size={28} />,
    title: "الكورس العلاجي عن بعد",
    desc: "كورس علاجي منهجي مخصص للحالات التي لا يمكنها السفر، مع توفير دعم وإرشاد وتوجيه ذاتي بخطوات واضحة وطرق علمية.",
    features: [
      "علاج ذاتي منهجي منزلي",
      "متابعة وإرشاد على فترات",
      "برامج وقائية وحماية للأسرة",
    ],
    gradient: "from-primary-light to-primary",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 left-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-6 animate-[fade-in_0.6s_ease-out]">
            <Sparkles size={14} className="text-accent" />
            <span>تبدأ رحلتك العلاجية من هنا</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 animate-[slide-up_0.6s_ease-out]">الخدمات العلاجية</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-[slide-up_0.6s_ease-out_0.15s_both]">
            نقدم مجموعة متكاملة من خدمات الرقية الشرعية للتعافي من الأمراض الروحية، وكلها تبدأ بخطوة واحدة أساسية للتقييم الصحيح
          </p>
        </div>
      </section>

      {/* The ONE Product Funnel: Paid Consultation */}
      <section className="py-16 mt-[-4rem] relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-primary/20 overflow-hidden relative animate-[fade-in_0.8s_ease-out_0.3s_both]">
            {/* Background design */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="p-8 lg:p-12">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-bold text-text-primary">
                    الاستشارة الصوتية (المدفوعة)
                  </h2>
                  <p className="text-text-secondary leading-relaxed text-lg">
                    بوابة الدخول الإلزامية لجميع خدماتنا العلاجية والتشخيصية. لأن كل حالة تختلف عن الأخرى، لا يمكننا البدء بأي برنامج علاجي أو استقبال أي مريض بشكل مباشر قبل إجراء تقييم دقيق وشامل لحالته عبر الاستشارة الصوتية.
                  </p>
                  
                  <div className="space-y-4 pt-4">
                    <h3 className="font-semibold text-text-primary">لماذا نبدأ بالاستشارة؟</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {[
                        "التأكد من جدية المريض والتزامه بالعلاج",
                        "فهم المشكلة وسبب الاتصال بشكل دقيق",
                        "تحديد إمكانية التكاليف والميزانية",
                        "توضيح شروط العلاج بكل شفافية",
                        "توجيهك للخدمة الأنسب لك",
                        "تحديد الحاجة لحضور مباشر أو عن بعد"
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <UserCheck size={20} className="text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-text-secondary text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="w-full md:w-[340px] bg-bg rounded-2xl p-8 text-center border border-border shrink-0 shadow-inner">
                  <h3 className="font-bold text-2xl text-text-primary mb-3">احجز استشارتك</h3>
                  <p className="text-sm text-text-secondary mb-8 leading-relaxed">
                    قم بتعبئة بياناتك وسيتواصل معك موظف الاستقبال لتحديد الموعد مع الراقي المختص
                  </p>
                  <Link
                    href="/booking"
                    className="flex flex-col items-center justify-center gap-2 w-full py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <span className="flex items-center gap-2">احجز موعدك الآن <ArrowLeft size={20} /></span>
                  </Link>
                  <div className="mt-6 flex flex-col gap-2">
                    <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5">
                      <ShieldAlert size={14} className="text-green-500" />
                      سرية بيانات تامة ومضمونة
                    </p>
                    <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5">
                      <Clock size={14} className="text-primary" />
                      تواصل سريع لترتيب الموعد
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 lg:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              ماذا بعد الاستشارة الأولية؟
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed text-lg">
              بناءً على التقييم الدقيق في الجلسة الاستشارية، سيتم العمل معك وتوجيهك لإحدى الخدمات التالية لتكون جزءاً من خطتك العلاجية الكاملة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col relative"
              >
                <div className={`h-2 bg-gradient-to-l ${service.gradient}`} />
                <div className="p-8 flex-1 flex flex-col">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-6 flex-1">
                    {service.desc}
                  </p>
                  
                  <div className="bg-bg rounded-xl p-5 mt-auto border border-border/50">
                    <h4 className="text-sm font-semibold text-text-primary mb-3">
                      ميزات الخدمة:
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                          <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                          <span className="leading-tight">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-6">
            لا تتردد، فالشفاء يبدأ بخطوة
          </h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            الاستشارة الصوتية هي المفتاح للتعرف على حالتك بدقة والبدء بمسار العلاج الشافي والمخصص لك بإذن الله دون تكاليف عشوائية.
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-primary text-white font-bold text-xl hover:bg-primary-light transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
          >
            <Phone size={24} className="group-hover:animate-pulse" />
            سجل حالتك للبدء الآن
          </Link>
        </div>
      </section>
    </>
  );
}
