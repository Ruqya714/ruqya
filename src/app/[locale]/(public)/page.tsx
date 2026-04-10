import { Link } from "@/i18n/routing";
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
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return {
    title: t("heroTitle1") + " " + t("heroTitle2"),
    description: t("heroDesc"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  const aboutFeatures = [
    { icon: <Shield size={24} />, titleKey: "feature1Title" as const, descKey: "feature1Desc" as const },
    { icon: <Globe size={24} />, titleKey: "feature2Title" as const, descKey: "feature2Desc" as const },
    { icon: <Users size={24} />, titleKey: "feature3Title" as const, descKey: "feature3Desc" as const },
  ];

  const services = [
    { icon: <Phone size={24} />, titleKey: "svc1Title" as const, descKey: "svc1Desc" as const, color: "primary" },
    { icon: <BookOpen size={24} />, titleKey: "svc2Title" as const, descKey: "svc2Desc" as const, color: "accent" },
    { icon: <Heart size={24} />, titleKey: "svc3Title" as const, descKey: "svc3Desc" as const, color: "primary" },
    { icon: <Star size={24} />, titleKey: "svc4Title" as const, descKey: "svc4Desc" as const, color: "accent" },
  ];

  const treatCategories = [
    { icon: <Shield size={28} />, titleKey: "treat1Title" as const, itemsKey: "treat1Items" as const, gradient: "from-primary to-primary-dark" },
    { icon: <Heart size={28} />, titleKey: "treat2Title" as const, itemsKey: "treat2Items" as const, gradient: "from-accent to-accent-dark" },
    { icon: <Sparkles size={28} />, titleKey: "treat3Title" as const, itemsKey: "treat3Items" as const, gradient: "from-teal-dark to-primary-dark" },
    { icon: <CheckCircle size={28} />, titleKey: "treat4Title" as const, itemsKey: "treat4Items" as const, gradient: "from-primary-light to-primary" },
  ];

  const faqs = [
    { qKey: "faq1Q" as const, aKey: "faq1A" as const },
    { qKey: "faq2Q" as const, aKey: "faq2A" as const },
    { qKey: "faq3Q" as const, aKey: "faq3A" as const },
    { qKey: "faq4Q" as const, aKey: "faq4A" as const },
  ];

  return (
    <>
      {/* ========== Hero Section ========== */}
      <section className="relative gradient-hero text-white">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div className="absolute top-20 start-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
          <div className="absolute bottom-10 end-10 w-96 h-96 rounded-full bg-primary-light blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-8 animate-[fade-in_0.6s_ease-out]">
              <Sparkles size={14} className="text-accent" />
              <span>{t("badge")}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight mb-6 animate-[slide-up_0.6s_ease-out]">
              {t("heroTitle1")}{" "}
              <span className="text-gradient">{t("heroTitle2")}</span>
              <br />
              {t("heroTitle3")}
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl mx-auto animate-[slide-up_0.6s_ease-out_0.15s_both]">
              {t("heroDesc")}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-[slide-up_0.6s_ease-out_0.3s_both]">
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone size={20} />
                {t("ctaBook")}
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl glass font-medium hover:bg-white/15 transition-all duration-300"
              >
                {t("ctaAbout")}
                <ArrowLeft size={18} className="rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 md:gap-6 mt-16 max-w-lg mx-auto animate-[fade-in_0.6s_ease-out_0.5s_both]">
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-accent">+1000</p>
                <p className="text-xs text-gray-300 mt-1">{t("statCases")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-accent">+25</p>
                <p className="text-xs text-gray-300 mt-1">{t("statYears")}</p>
              </div>
              <div className="text-center">
                <p className="text-2xl lg:text-3xl font-bold text-accent">+20</p>
                <p className="text-xs text-gray-300 mt-1">{t("statCountries")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute -bottom-[2px] end-0 start-0">
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
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("aboutTitle")}</h2>
            <p className="text-text-secondary leading-relaxed">{t("aboutDesc")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutFeatures.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">{t(item.titleKey)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== Services Section ========== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("servicesTitle")}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t("servicesDesc")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((service, i) => (
              <div key={i} className="relative p-6 rounded-xl border border-border hover:border-primary/20 bg-bg hover:shadow-lg transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${
                  service.color === "primary"
                    ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                    : "bg-accent/10 text-accent-dark group-hover:bg-accent group-hover:text-white"
                }`}>
                  {service.icon}
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">{t(service.titleKey)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">{t(service.descKey)}</p>
                <Link href="/booking" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-light transition-colors">
                  {t("bookNow")}
                  <ArrowLeft size={14} className="rtl:rotate-0 ltr:rotate-180" />
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
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("treatTitle")}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t("treatDesc")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {treatCategories.map((category, i) => {
              const items = t.raw(category.itemsKey) as string[];
              return (
                <div key={i} className="relative overflow-hidden rounded-xl bg-white border border-border hover:shadow-lg transition-all duration-300 group">
                  <div className={`h-2 bg-gradient-to-l ${category.gradient}`} />
                  <div className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform duration-300">
                      {category.icon}
                    </div>
                    <h3 className="font-semibold text-lg text-text-primary mb-3">{t(category.titleKey)}</h3>
                    <ul className="space-y-2">
                      {items.map((item: string, j: number) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-text-secondary">
                          <CheckCircle size={14} className="text-primary flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========== FAQ Preview Section ========== */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("faqTitle")}</h2>
            <p className="text-text-secondary">{t("faqDesc")}</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <details key={i} className="group bg-bg rounded-lg border border-border overflow-hidden">
                <summary className="flex items-center justify-between px-6 py-4 cursor-pointer text-sm font-medium text-text-primary hover:bg-gray-50 transition-colors list-none">
                  {t(faq.qKey)}
                  <Clock size={16} className="text-text-secondary transition-transform duration-300 group-open:rotate-90 flex-shrink-0 ms-4" />
                </summary>
                <div className="px-6 pb-4 text-sm text-text-secondary leading-relaxed">
                  {t(faq.aKey)}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/faq" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary-light transition-colors">
              {t("viewAllFaq")}
              <ArrowLeft size={14} className="rtl:rotate-0 ltr:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ========== Final CTA ========== */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="gradient-hero rounded-2xl p-8 lg:p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 end-0 w-48 h-48 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute bottom-0 start-0 w-64 h-64 rounded-full bg-primary-light/10 blur-3xl" />

            <div className="relative">
              <h2 className="text-2xl lg:text-4xl font-bold mb-4">{t("ctaTitle")}</h2>
              <p className="text-gray-200 text-lg mb-8 max-w-xl mx-auto">{t("ctaDesc")}</p>
              <Link
                href="/booking"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                <Phone size={20} />
                {t("ctaBook")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
