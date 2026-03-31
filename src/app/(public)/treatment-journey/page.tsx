import type { Metadata } from "next";
import Link from "next/link";
import { Phone, ClipboardList, Stethoscope, BookOpen, HeartPulse, ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "الرحلة العلاجية",
  description: "تعرف على مراحل العلاج الست في مركز الرقية بكلام الرحمن — من التسجيل حتى التعافي بإذن الله",
};

const stages = [
  {
    step: 1,
    icon: <ClipboardList size={24} />,
    title: "التسجيل",
    desc: "تسجيل بياناتك ووصف حالتك من خلال نموذج الحجز على الموقع مع تحديد الخدمة المناسبة",
    color: "primary",
  },
  {
    step: 2,
    icon: <Phone size={24} />,
    title: "الاستشارة الأولية",
    desc: "مكالمة صوتية مع المعالج لسماع تفاصيل الحالة والإجابة على الاستفسارات",
    color: "accent",
  },
  {
    step: 3,
    icon: <Stethoscope size={24} />,
    title: "التشخيص",
    desc: "جلسة رقية شرعية للتشخيص وتحديد نوع الإصابة باستخدام آيات القرآن الكريم المخصصة",
    color: "primary",
  },
  {
    step: 4,
    icon: <BookOpen size={24} />,
    title: "البرنامج العلاجي",
    desc: "وضع خطة علاجية مفصّلة تشمل: أوراد يومية، رقية ذاتية، تعليمات غذائية، وتحصينات",
    color: "accent",
  },
  {
    step: 5,
    icon: <HeartPulse size={24} />,
    title: "المتابعة والعلاج",
    desc: "جلسات علاج دورية مع متابعة مستمرة لتطور الحالة وتعديل البرنامج حسب الحاجة",
    color: "primary",
  },
  {
    step: 6,
    icon: <ShieldCheck size={24} />,
    title: "التعافي والتحصين",
    desc: "بعد التعافي بإذن الله، نزوّدك ببرنامج تحصين دائم للوقاية من أي إصابة مستقبلية",
    color: "accent",
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
            ستّ مراحل مدروسة تبدأ بالتسجيل وتنتهي بالتعافي والتحصين بإذن الله
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute right-6 lg:right-1/2 top-0 bottom-0 w-0.5 bg-border lg:-translate-x-1/2" />

            <div className="space-y-12">
              {stages.map((stage, i) => (
                <div
                  key={i}
                  className={`relative flex items-start gap-6 lg:gap-12 ${
                    i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
                  }`}
                >
                  {/* Content */}
                  <div className={`flex-1 mr-12 lg:mr-0 ${i % 2 === 0 ? "lg:text-left" : "lg:text-right"}`}>
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
                  <div className="absolute right-0 lg:right-1/2 lg:-translate-x-1/2 flex-shrink-0">
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
