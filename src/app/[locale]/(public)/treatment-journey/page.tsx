"use client";

import { Link } from "@/i18n/routing";
import { Phone, ClipboardList, Stethoscope, BookOpen, HeartPulse, ShieldCheck, ArrowLeft, Home } from "lucide-react";
import { useTranslations } from "next-intl";

export default function TreatmentJourneyPage() {
  const t = useTranslations("Journey");

  const stages = [
    { step: 1, icon: <ClipboardList size={24} />, titleKey: "step1Title" as const, descKey: "step1Desc" as const, color: "primary" },
    { step: 2, icon: <Phone size={24} />, titleKey: "step2Title" as const, descKey: "step2Desc" as const, color: "accent" },
    { step: 3, icon: <Stethoscope size={24} />, titleKey: "step3Title" as const, descKey: "step3Desc" as const, color: "primary" },
    { step: 4, icon: <BookOpen size={24} />, titleKey: "step4Title" as const, descKey: "step4Desc" as const, color: "accent" },
    { step: 5, icon: <Home size={24} />, titleKey: "step5Title" as const, descKey: "step5Desc" as const, color: "primary" },
    { step: 6, icon: <HeartPulse size={24} />, titleKey: "step6Title" as const, descKey: "step6Desc" as const, color: "accent" },
    { step: 7, icon: <ShieldCheck size={24} />, titleKey: "step7Title" as const, descKey: "step7Desc" as const, color: "primary" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 end-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">{t("heroTitle")}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">{t("heroDesc")}</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute start-6 lg:right-1/2 top-0 bottom-0 w-0.5 bg-border lg:translate-x-1/2" />
            <div className="space-y-12">
              {stages.map((stage, i) => (
                <div key={i} className={`relative flex items-start gap-6 lg:gap-12 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className="flex-1 ms-12 lg:ms-0 text-start">
                    <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stage.color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-dark"}`}>
                          {stage.icon}
                        </div>
                        <h3 className="font-bold text-lg text-text-primary">{t(stage.titleKey)}</h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{t(stage.descKey)}</p>
                    </div>
                  </div>
                  <div className="absolute start-0 lg:right-1/2 lg:translate-x-1/2 flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${stage.color === "primary" ? "bg-primary" : "bg-accent"}`}>
                      {stage.step}
                    </div>
                  </div>
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
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("ctaTitle")}</h2>
          <p className="text-text-secondary mb-8">{t("ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all shadow-lg">
              <Phone size={20} />
              {t("ctaBook")}
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all">
              {t("ctaServices")}
              <ArrowLeft size={16} className="rtl:rotate-0 ltr:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
