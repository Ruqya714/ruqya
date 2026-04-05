import Link from "next/link";
import {
  Phone,
  Shield,
  Heart,
  Sparkles,
  BookOpen,
  ArrowLeft,
  Star,
  CheckCircle,
  Users,
  Clock,
  Globe,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ========== Hero Section ========== */}
      <section className="relative gradient-hero text-white">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-20 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-primary-light blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-8 animate-[fade-in_0.6s_ease-out]">
              <Sparkles size={14} className="text-accent" />
              <span>مركز متخصص في الرقية الشرعية منذ 2017</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 animate-[slide-up_0.6s_ease-out]">
              مركز الرقية{" "}
              <span className="text-gradient">بكلام الرحمن</span>
              <br />
              لرد كيد الشيطان
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl mx-auto animate-[slide-up_0.6s_ease-out_0.15s_both]">
              نسعى بإذن الله لمساعدتك على التعافي من الأمراض الروحية والنفسية
              من خلال العلاج بكتاب الله وسنة رسوله ﷺ
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[slide-up_0.6s_ease-out_0.3s_both]">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone size={20} />
                سجّل حالتك الآن
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass font-medium hover:bg-white/15 transition-all duration-300"
              >
                تعرّف علينا
                <ArrowLeft size={18} />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto animate-[fade-in_0.6s_ease-out_0.5s_both]">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-accent">+1000</p>
                <p className="text-xs text-gray-300 mt-1">حالة تم علاجها</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-accent">+7</p>
                <p className="text-xs text-gray-300 mt-1">سنوات خبرة</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-accent">+20</p>
                <p className="text-xs text-gray-300 mt-1">دولة حول العالم</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute -bottom-[2px] left-0 right-0">
          <svg className="w-full block" viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 80L48 74.7C96 69 192 59 288 53.3C384 48 480 48 576 53.3C672 59 768 69 864 69.3C960 69 1056 59 1152 53.3C1248 48 1344 48 1392 48L1440 48V80H1392C1344 80 1248 80 1152 80C1056 80 960 80 864 80C768 80 672 80 576 80C480 80 384 80 288 80C192 80 96 80 48 80H0Z"
              fill="var(--color-bg)"
            />
          </svg>
        </div>
      </section>

      {/* ========== About Section ========== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              من نحن
            </h2>
            <p className="text-text-secondary leading-relaxed">
              مركز متخصص في الرقية الشرعية تأسس عام 2017 في إسطنبول، يقدم خدمات
              العلاج بالقرآن الكريم والسنة النبوية عبر الإنترنت لجميع أنحاء العالم.
              نجمع بين الأصالة الشرعية والمنهج العلمي المنظم.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Shield size={24} />,
                title: "منهج شرعي صحيح",
                desc: "نلتزم بالكتاب والسنة في جميع أساليب العلاج والرقية",
              },
              {
                icon: <Globe size={24} />,
                title: "استشارات أونلاين",
                desc: "نقدم خدماتنا لجميع أنحاء العالم عبر الاستشارات الصوتية",
              },
              {
                icon: <Users size={24} />,
                title: "فريق متخصص",
                desc: "معالجون ذوو خبرة طويلة في مجال الرقية الشرعية والعلاج",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-xl border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Services Section ========== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              خدماتنا
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              نقدم مجموعة متكاملة من الخدمات العلاجية المتخصصة في الرقية الشرعية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              {
                icon: <Phone size={24} />,
                title: "الاستشارة الصوتية والمجانية",
                desc: "جلسة استشارية صوتية مع الراقي لتقييم الحالة والإرشاد للخطة العلاجية قبل البدء بتحديد العلاج",
                color: "primary",
              },
              {
                icon: <BookOpen size={24} />,
                title: "التشخيص بالرقية",
                desc: "جلسة متخصصة لقراءة الرقية ومراقبة الأعراض لتحديد نوع الإصابة بدقة عالية",
                color: "accent",
              },
              {
                icon: <Heart size={24} />,
                title: "العلاج بإشراف خاص",
                desc: "برنامج علاجي مخصص ومباشر مع استخراج العقد ودعم متواصل حتى الشفاء التام وللحالات المستعصية",
                color: "primary",
              },
              {
                icon: <Star size={24} />,
                title: "الكورس العلاجي الذاتي عن بعد",
                desc: "كورس علاجي منهجي مخصص للحالات التي لا يمكنها السفر، مع خدمات التوجيه والدعم الذاتي",
                color: "accent",
              },
            ].map((service, i) => (
              <div
                key={i}
                className="relative p-6 rounded-xl border border-border hover:border-primary/20 bg-bg hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                    service.color === "primary"
                      ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      : "bg-accent/10 text-accent-dark group-hover:bg-accent group-hover:text-white"
                  }`}
                >
                  {service.icon}
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {service.desc}
                </p>
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors"
                >
                  احجز الآن
                  <ArrowLeft size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== What We Treat Section ========== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              ما الذي يمكن علاجه؟
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              نعالج بإذن الله مختلف الحالات الروحية والنفسية والصحية
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Shield size={28} />,
                title: "الأمراض الروحية",
                items: ["العين والحسد", "السحر بأنواعه", "المس والتلبس"],
                gradient: "from-primary to-primary-dark",
              },
              {
                icon: <Heart size={28} />,
                title: "الأمراض النفسية",
                items: ["القلق والاكتئاب", "الوسواس القهري", "الأرق المزمن"],
                gradient: "from-accent to-accent-dark",
              },
              {
                icon: <Sparkles size={28} />,
                title: "الحالات المستعصية",
                items: ["أمراض السرطان والتوحد", "الصرع والتهاب الكبد", "الإسقاط المتكرر وتأخر الإنجاب"],
                gradient: "from-teal-dark to-primary-dark",
              },
              {
                icon: <CheckCircle size={28} />,
                title: "التحصين والوقاية",
                items: ["التحصين اليومي", "تحصين المنزل", "حماية الأطفال"],
                gradient: "from-primary-light to-primary",
              },
            ].map((category, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-xl bg-white border border-border hover:shadow-lg transition-all duration-300 group"
              >
                <div
                  className={`h-2 bg-gradient-to-l ${category.gradient}`}
                />
                <div className="p-6">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-lg text-text-primary mb-3">
                    {category.title}
                  </h3>
                  <ul className="space-y-2">
                    {category.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-2 text-sm text-text-secondary"
                      >
                        <CheckCircle
                          size={14}
                          className="text-primary flex-shrink-0"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FAQ Preview Section ========== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">
              الأسئلة الشائعة
            </h2>
            <p className="text-text-secondary">
              إجابات لأكثر الأسئلة شيوعاً حول خدماتنا
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "كيف يمكنني البدء بالعلاج بإشراف خاص؟",
                a: "قم بتسجيل حالتك وسيتواصل معك موظف الاستقبال لتقييم حالتك، ثم تقوم بالتواصل مع الراقي المشرف عبر مكالمة استشارية للتعرف على حالتك بشكل مفصل ومن هناك ستكون تفاصيل الرحلة واضحة بإذن الله.",
              },
              {
                q: "هل يتم علاج الحالة بشكل كامل عن بعد؟",
                a: "نحن نركز على المريض الذي لديه إمكانية السفر لمكان إقامة الراقي في تركيا وذلك لضمان تقديم الخدمة على أكمل وجه كما أننا وفرنا كورساً علاجياً عن بعد للحالات التي لا يمكنها السفر ولكن بدعم وإرشاد محدود.",
              },
              {
                q: "هل يمكن زيارة المركز مباشر للتشخيص والعلاج بدون استشارة أولية؟",
                a: "هناك أسباب لعدم استقبالنا المرضى بشكل مباشر إلا بعد الموعد: 1- للتأكد من الجدية. 2- لفهم الحالة الصحية. 3- ليعرف المريض إمكانيته المادية للعلاج. 4- لتوضيح شروط العلاج. 5- لتحديد إن كان مؤهلاً للحضور.",
              },
              {
                q: "كم تكاليف العلاج؟",
                a: "بسبب اختلاف تكلفة العلاج من مريض لآخر لا يمكن عرض سعر ثابت أو تقريبي للخدمة دون معرفة تفاصيل حالة المريض، لأن التكلفة تختلف حسب المشكلة والزمن اللازم وعدد الأفراد المصابين. لذلك نطلب حجز موعد لاستشارة صوتية أولاً لمعرفة التكلفة وتحديدها بدقة لك.",
              },
            ].map((faq, i) => (
              <details
                key={i}
                className="group bg-bg rounded-lg border border-border overflow-hidden"
              >
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-text-primary hover:bg-gray-50 transition-colors list-none">
                  {faq.q}
                  <Clock
                    size={16}
                    className="text-text-secondary transition-transform duration-300 group-open:rotate-90 flex-shrink-0 mr-4"
                  />
                </summary>
                <div className="px-6 pb-4 text-sm text-text-secondary leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/faq"
              className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors"
            >
              عرض جميع الأسئلة
              <ArrowLeft size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Final CTA ========== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-hero rounded-2xl p-8 lg:p-16 text-center text-white relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 left-0 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-2xl lg:text-4xl font-bold mb-4">
                هل أنت مستعد للبدء؟
              </h2>
              <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto">
                سجّل حالتك الآن وسيتم التواصل معك من قبل أحد المتخصصين لتحديد
                موعد الاستشارة المناسب
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone size={20} />
                سجّل حالتك الآن
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
