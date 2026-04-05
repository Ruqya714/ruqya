"use client";

import { Link } from "@/i18n/routing";
import { Phone, BookOpen, Heart, Star, Clock, ArrowLeft, CheckCircle, ShieldAlert, Sparkles, UserCheck, Activity, ShieldCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ServicesPage() {
  const t = useTranslations("Services");

  const whyItems = t.raw("whyItems") as string[];

  const treatCards = [
    { titleKey: "treat1Title" as const, descKey: "treat1Desc" as const, icon: <Sparkles className="w-8 h-8 text-white" /> },
    { titleKey: "treat2Title" as const, descKey: "treat2Desc" as const, icon: <Heart className="w-8 h-8 text-white" /> },
    { titleKey: "treat3Title" as const, descKey: "treat3Desc" as const, icon: <Activity className="w-8 h-8 text-white" /> },
    { titleKey: "treat4Title" as const, descKey: "treat4Desc" as const, icon: <ShieldCheck className="w-8 h-8 text-white" /> },
  ];

  const servicesList = [
    {
      icon: <BookOpen size={28} />,
      titleKey: "svc1Title" as const,
      descKey: "svc1Desc" as const,
      featuresKey: "svc1Features" as const,
      gradient: "from-accent to-accent-dark",
    },
    {
      icon: <Heart size={28} />,
      titleKey: "svc2Title" as const,
      descKey: "svc2Desc" as const,
      featuresKey: "svc2Features" as const,
      gradient: "from-teal-dark to-primary-dark",
    },
    {
      icon: <Star size={28} />,
      titleKey: "svc3Title" as const,
      descKey: "svc3Desc" as const,
      featuresKey: "svc3Features" as const,
      gradient: "from-primary-light to-primary",
    },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 end-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-6 animate-[fade-in_0.6s_ease-out]">
            <Sparkles size={14} className="text-accent" />
            <span>{t("heroTag")}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 animate-[slide-up_0.6s_ease-out]">{t("heroTitle")}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-[slide-up_0.6s_ease-out_0.15s_both]">{t("heroDesc")}</p>
        </div>
      </section>

      {/* Consultation Card */}
      <section className="py-16 mt-[-2rem] lg:mt-[-3rem] relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-primary/20 overflow-hidden relative animate-[fade-in_0.8s_ease-out_0.3s_both]">
            <div className="absolute top-0 start-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="p-8 lg:p-12">
              <div className="flex flex-col md:flex-row gap-10 items-center">
                <div className="flex-1 space-y-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-2">
                    <Phone className="w-8 h-8" />
                  </div>
                  <h2 className="text-2xl lg:text-4xl font-bold text-text-primary">{t("consultTitle")}</h2>
                  <p className="text-text-secondary leading-relaxed text-lg">{t("consultDesc")}</p>
                  <div className="space-y-4 pt-4">
                    <h3 className="font-semibold text-text-primary">{t("whyConsult")}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {whyItems.map((item: string, i: number) => (
                        <div key={i} className="flex items-start gap-3">
                          <UserCheck size={20} className="text-accent flex-shrink-0 mt-0.5" />
                          <span className="text-text-secondary text-sm font-medium">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-[340px] bg-bg rounded-2xl p-8 text-center border border-border shrink-0 shadow-inner">
                  <h3 className="font-bold text-2xl text-text-primary mb-3">{t("bookConsult")}</h3>
                  <p className="text-sm text-text-secondary mb-8 leading-relaxed">{t("bookConsultDesc")}</p>
                  <Link
                    href="/booking"
                    className="flex flex-col items-center justify-center gap-2 w-full py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <span className="flex items-center gap-2">{t("bookNowCTA")} <ArrowLeft size={20} className="rtl:rotate-0 ltr:rotate-180" /></span>
                  </Link>
                  <div className="mt-6 flex flex-col gap-2">
                    <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5">
                      <ShieldAlert size={14} className="text-green-500" />
                      {t("confidential")}
                    </p>
                    <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5">
                      <Clock size={14} className="text-primary" />
                      {t("fastContact")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What can be treated */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 end-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">{t("treatTitle")}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed text-lg">{t("treatDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {treatCards.map((item, i) => (
              <div key={i} className="bg-primary text-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group border border-white/10 flex flex-col items-center text-center">
                <div className="absolute top-0 start-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{t(item.titleKey)}</h3>
                  <p className="text-gray-100 leading-relaxed text-sm md:text-base font-medium">{t(item.descKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 lg:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("afterConsultTitle")}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed text-lg">{t("afterConsultDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesList.map((service, i) => {
              const features = t.raw(service.featuresKey) as string[];
              return (
                <div key={i} className="bg-white rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col relative">
                  <div className={`h-2 bg-gradient-to-l ${service.gradient}`} />
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-text-primary mb-3">{t(service.titleKey)}</h3>
                    <p className="text-text-secondary leading-relaxed mb-6">{t(service.descKey)}</p>
                    <div className="bg-bg rounded-xl p-5 border border-border/50">
                      <h4 className="text-sm font-semibold text-text-primary mb-3">{t("serviceFeatures")}</h4>
                      <ul className="space-y-3">
                        {features.map((f: string, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-text-secondary">
                            <CheckCircle size={16} className="text-primary flex-shrink-0 mt-0.5" />
                            <span className="leading-tight">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-6">{t("ctaTitle")}</h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg leading-relaxed">{t("ctaDesc")}</p>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-primary text-white font-bold text-xl hover:bg-primary-light transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
          >
            <Phone size={24} className="group-hover:animate-pulse" />
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </>
  );
}
