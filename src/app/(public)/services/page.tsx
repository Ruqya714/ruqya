import type { Metadata } from "next";
import Link from "next/link";
import { Phone, BookOpen, Heart, Star, Clock, ArrowLeft, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "خدماتنا",
  description: "خدمات الرقية الشرعية — الاستشارة الصوتية، التشخيص والعلاج، العلاج بإشراف خاص، والكورسات التعليمية",
};

const services = [
  {
    icon: <Phone size={28} />,
    title: "الاستشارة الصوتية",
    duration: "30 دقيقة",
    desc: "جلسة استشارية صوتية مع أحد المعالجين المتخصصين لتقييم حالتك وتحديد خطة العلاج المناسبة لك.",
    features: [
      "تقييم شامل للحالة",
      "تحديد نوع الإصابة",
      "وصف برنامج علاجي أولي",
      "توجيهات وإرشادات عملية",
    ],
    gradient: "from-primary to-primary-dark",
  },
  {
    icon: <BookOpen size={28} />,
    title: "التشخيص والعلاج",
    duration: "60 دقيقة",
    desc: "جلسة رقية شرعية كاملة مع تشخيص دقيق للحالة باستخدام آيات الرقية الشرعية ووصف البرنامج العلاجي الكامل.",
    features: [
      "رقية شرعية كاملة",
      "تشخيص دقيق بالآيات القرآنية",
      "برنامج علاجي مفصّل",
      "أوراد وأذكار مخصصة",
    ],
    gradient: "from-accent to-accent-dark",
  },
  {
    icon: <Heart size={28} />,
    title: "العلاج بإشراف خاص",
    duration: "برنامج متكامل",
    desc: "برنامج علاجي شامل بإشراف مباشر من المعالج مع متابعة يومية ومستمرة حتى الوصول للتعافي بإذن الله.",
    features: [
      "إشراف مباشر ومتابعة يومية",
      "جلسات رقية متعددة",
      "تعديل البرنامج حسب التطور",
      "دعم متواصل حتى التعافي",
    ],
    gradient: "from-teal-dark to-primary-dark",
  },
  {
    icon: <Star size={28} />,
    title: "الكورسات والدورات",
    duration: "حسب الدورة",
    desc: "دورات تعليمية متخصصة في التحصين الذاتي والرقية والعلاج بالقرآن الكريم لتتعلم كيف تحمي نفسك وأسرتك.",
    features: [
      "تعلّم الرقية الذاتية",
      "أساليب التحصين اليومي",
      "حماية المنزل والأسرة",
      "شهادة إتمام الدورة",
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
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">خدماتنا</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            نقدم مجموعة متكاملة من خدمات الرقية الشرعية والعلاج بالقرآن الكريم
            لمساعدتك على التعافي بإذن الله
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {services.map((service, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <div className={`h-2 bg-gradient-to-l ${service.gradient}`} />
              <div className="p-6 lg:p-10">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        {service.icon}
                      </div>
                      <div>
                        <h2 className="text-xl lg:text-2xl font-bold text-text-primary">
                          {service.title}
                        </h2>
                        <div className="flex items-center gap-1.5 text-sm text-text-secondary mt-1">
                          <Clock size={14} />
                          {service.duration}
                        </div>
                      </div>
                    </div>
                    <p className="text-text-secondary leading-relaxed mb-6">
                      {service.desc}
                    </p>
                    <Link
                      href="/booking"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all duration-200 shadow-sm"
                    >
                      احجز الآن
                      <ArrowLeft size={16} />
                    </Link>
                  </div>

                  {/* Features */}
                  <div className="lg:w-80 bg-bg rounded-xl p-6">
                    <h4 className="font-semibold text-text-primary mb-4">
                      ما تتضمنه الخدمة:
                    </h4>
                    <ul className="space-y-3">
                      {service.features.map((f, j) => (
                        <li key={j} className="flex items-center gap-3 text-sm text-text-secondary">
                          <CheckCircle size={16} className="text-primary flex-shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
            لا تعرف أي خدمة تناسبك؟
          </h2>
          <p className="text-text-secondary mb-8 max-w-xl mx-auto">
            ابدأ بالاستشارة الصوتية وسيقوم المعالج بتوجيهك للخدمة الأنسب لحالتك
          </p>
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg"
          >
            <Phone size={20} />
            سجّل حالتك الآن
          </Link>
        </div>
      </section>
    </>
  );
}
