import type { Metadata } from "next";
import Link from "next/link";
import { Phone, ClipboardList, Stethoscope, BookOpen, HeartPulse, ShieldCheck, ArrowLeft, Home } from "lucide-react";

export const metadata: Metadata = {
  title: "الرحلة العلاجية",
  description: "تعرف على مراحل العلاج الست في مركز الرقية بكلام الرحمن — من التسجيل حتى التعافي بإذن الله",
};

const stages = [
  {
    step: 1,
    icon: <ClipboardList size={24} />,
    title: "1- سجل حالتك في المركز",
    desc: "سجل طلبك وسيقوم موظف الاستقبال بالتواصل معك لشرح تفاصيل العلاج بإشراف المعالج وبشكل خاص وهذا الإجراء مهم لنا لنقدم لك أفضل خدمة ممكن بدون عشوائية.",
    color: "primary",
  },
  {
    step: 2,
    icon: <Phone size={24} />,
    title: "2- حجز موعد استشارة",
    desc: "بعد التواصل معك سيقوم الموظف بحجز موعد استشارة لك ويرسل لك جميع التفاصيل بالموعد وستتواصل مع المعالج بشكل مباشر في الموعد المحدد بدون تأخير أو تأجيل.",
    color: "accent",
  },
  {
    step: 3,
    icon: <Stethoscope size={24} />,
    title: "3- الاستشارة الصوتية",
    desc: "هي عبارة عن مكالمة صوتية بينك وبين الراقي وتكون عبر برنامج google meet تشرح من خلالها المشكلة بشكل مفصل وسيقوم الراقي بتقييم حالتك وإرشادك للخطة العلاجية المناسبة لك كما سيقوم بتزويدك بشروط العلاج وتكاليفه.",
    color: "primary",
  },
  {
    step: 4,
    icon: <BookOpen size={24} />,
    title: "4- جلسة التشخيص واستلام العلاج",
    desc: "بعد جلسة الاستشارة ستنتقل لجلسة التشخيص وهي عبارة عن جلسة تتم فيها قراءة الرقية الشرعية للتأكد من الحالة الروحية ثم نقوم بتسليم العلاج ونتابع حالتك عبر الهاتف حتى تصل لمرحلة جلسات الاستفراغ.",
    color: "accent",
  },
  {
    step: 5,
    icon: <Home size={24} />,
    title: "5- بعد استلامك العلاج! أين تطبق العلاج",
    desc: "يكون استخدام العلاج في منزلك وسيتواصل معك الراقي بشكل دوري ليتابع حالتك عبر الهاتف ومكالمات فيديو ورسائل صوتية وكتابية وسيقدم لك الدعم بشكل مستمر خلال هذه الفترة بإذن الله.",
    color: "primary",
  },
  {
    step: 6,
    icon: <HeartPulse size={24} />,
    title: "6- جلسات الاستفراغ",
    desc: "بعد انتهاء مدة البرنامج ستبدأ جلسات الاستفراغ وتكون اما مباشره في مكان سكنك او عبر مكالمات فيديو او رسائل كتابية او صوتية و سيقوم الراقي بتقديم التوجيه المستمر والإرشاد الدائم والسند في هذه الجلسات.",
    color: "accent",
  },
  {
    step: 7,
    icon: <ShieldCheck size={24} />,
    title: "7- جلسات الرقية",
    desc: "بعد انتهاء من استخراج العقد ستكون جلسات الرقية حصريا مباشرة وذلك من أجل تحقيق أكبر فائدة للمريض والتعامل مع الحالة بكل احترافية وتكون الجلسات في منزل خاص بالمريض ويزوره الراقي.",
    color: "primary",
  },
];

export default function TreatmentJourneyPage() {
  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">الرحلة العلاجية</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            سبع مراحل مدروسة تبدأ بالتسجيل وتنتهي بالتعافي والتحصين بإذن الله
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-6 lg:right-1/2 top-0 bottom-0 w-0.5 bg-border lg:translate-x-1/2" />

            <div className="space-y-12">
              {stages.map((stage, i) => (
                <div
                  key={i}
                  className={`relative flex items-start gap-6 lg:gap-12 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 mr-12 lg:mr-0 text-right`}>
                    <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            stage.color === "primary"
                              ? "bg-primary/10 text-primary"
                              : "bg-accent/10 text-accent-dark"
                          }`}
                        >
                          {stage.icon}
                        </div>
                        <h3 className="font-bold text-lg text-text-primary">
                          {stage.title}
                        </h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">
                        {stage.desc}
                      </p>
                    </div>
                  </div>

                  {/* Step number (circle on line) */}
                  <div className="absolute right-0 lg:right-1/2 lg:translate-x-1/2 flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                        stage.color === "primary" ? "bg-primary" : "bg-accent"
                      }`}
                    >
                      {stage.step}
                    </div>
                  </div>

                  {/* Empty space for alternating layout */}
                  <div className="hidden lg:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            ابدأ رحلتك نحو التعافي
          </h2>
          <p className="text-text-secondary mb-8">
            الخطوة الأولى هي الأهم. سجّل حالتك وسنكون معك في كل خطوة بإذن الله
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all shadow-lg"
            >
              <Phone size={20} />
              سجّل حالتك
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all"
            >
              تعرّف على خدماتنا
              <ArrowLeft size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
