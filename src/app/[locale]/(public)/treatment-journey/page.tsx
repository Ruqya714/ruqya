import { Link } from "@/i18n/routing";
import { Phone, ClipboardList, Stethoscope, BookOpen, HeartPulse, ShieldCheck, ArrowLeft, Home } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getCmsContent } from "@/lib/cms";

export default async function TreatmentJourneyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Journey" });

  const hero = await getCmsContent("treatment_journey", "hero", locale, {
    heroTitle: t("heroTitle"),
    heroDesc: t("heroDesc"),
  });

  const stepsData = await getCmsContent("treatment_journey", "steps", locale, {
    step1Title: t("step1Title"),
    step1Desc: t("step1Desc"),
    step2Title: t("step2Title"),
    step2Desc: t("step2Desc"),
    step3Title: t("step3Title"),
    step3Desc: t("step3Desc"),
    step4Title: t("step4Title"),
    step4Desc: t("step4Desc"),
    step5Title: t("step5Title"),
    step5Desc: t("step5Desc"),
    step6Title: t("step6Title"),
    step6Desc: t("step6Desc"),
    step7Title: t("step7Title"),
    step7Desc: t("step7Desc"),
  });

  const cta = await getCmsContent("treatment_journey", "cta", locale, {
    ctaTitle: t("ctaTitle"),
    ctaDesc: t("ctaDesc"),
    ctaBook: t("ctaBook"),
    ctaServices: t("ctaServices"),
  });

  const stages = [
    { step: 1, icon: <ClipboardList size={24} />, title: stepsData.step1Title || t("step1Title"), desc: stepsData.step1Desc || t("step1Desc"), color: "primary" },
    { step: 2, icon: <Phone size={24} />, title: stepsData.step2Title || t("step2Title"), desc: stepsData.step2Desc || t("step2Desc"), color: "accent" },
    { step: 3, icon: <Stethoscope size={24} />, title: stepsData.step3Title || t("step3Title"), desc: stepsData.step3Desc || t("step3Desc"), color: "primary" },
    { step: 4, icon: <BookOpen size={24} />, title: stepsData.step4Title || t("step4Title"), desc: stepsData.step4Desc || t("step4Desc"), color: "accent" },
    { step: 5, icon: <Home size={24} />, title: stepsData.step5Title || t("step5Title"), desc: stepsData.step5Desc || t("step5Desc"), color: "primary" },
    { step: 6, icon: <HeartPulse size={24} />, title: stepsData.step6Title || t("step6Title"), desc: stepsData.step6Desc || t("step6Desc"), color: "accent" },
    { step: 7, icon: <ShieldCheck size={24} />, title: stepsData.step7Title || t("step7Title"), desc: stepsData.step7Desc || t("step7Desc"), color: "primary" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 end-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">{hero.heroTitle}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">{hero.heroDesc}</p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute start-6 lg:start-1/2 top-0 bottom-0 w-0.5 bg-border lg:-ms-[1px] lg:translate-x-0" />
            <div className="space-y-12">
              {stages.map((stage, i) => (
                <div key={i} className={`relative flex items-start gap-6 lg:gap-12 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className="flex-1 ms-12 lg:ms-0 text-start">
                    <div className="bg-white rounded-xl border border-border p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stage.color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent-dark"}`}>
                          {stage.icon}
                        </div>
                        <h3 className="font-bold text-lg text-text-primary">{stage.title}</h3>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{stage.desc}</p>
                    </div>
                  </div>
                  <div className="absolute start-0 lg:start-1/2 lg:-ms-6 lg:translate-x-0 flex-shrink-0">
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
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{cta.ctaTitle}</h2>
          <p className="text-text-secondary mb-8">{cta.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/booking" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent text-white font-semibold text-lg hover:bg-accent-light transition-all shadow-lg">
              <Phone size={20} />
              {cta.ctaBook || t("ctaBook")}
            </Link>
            <Link href="/services" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-primary text-primary font-semibold hover:bg-primary hover:text-white transition-all">
              {cta.ctaServices || t("ctaServices")}
              <ArrowLeft size={16} className="rtl:rotate-0 ltr:rotate-180" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
