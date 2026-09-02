import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/routing";
import {
  Phone,
  BookOpen,
  Heart,
  Star,
  Clock,
  ArrowLeft,
  CheckCircle,
  ShieldAlert,
  Sparkles,
  UserCheck,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { getCmsContent } from "@/lib/cms";

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Services" });

  // 1. Dynamic Hero
  const hero = await getCmsContent("services", "hero", locale, {
    heroTag: t("heroTag"),
    heroTitle: t("heroTitle"),
    heroDesc: t("heroDesc"),
  });

  // 2. Dynamic Consultation Card & Why Points
  const consult = await getCmsContent("services", "consult_card", locale, {
    consultTitle: t("consultTitle"),
    consultDesc: t("consultDesc"),
    whyConsult: t("whyConsult"),
    whyItem1: "",
    whyItem2: "",
    whyItem3: "",
    whyItem4: "",
    whyItem5: "",
    whyItem6: "",
    bookConsult: t("bookConsult"),
    bookConsultDesc: t("bookConsultDesc"),
    bookNowCTA: t("bookNowCTA"),
    confidential: t("confidential"),
    fastContact: t("fastContact"),
  });

  // 3. Dynamic Treatments (4 cards)
  const treatments = await getCmsContent("services", "treat_section", locale, {
    treatTitle: t("treatTitle"),
    treatDesc: t("treatDesc"),
    treat1Title: t("treat1Title"),
    treat1Desc: t("treat1Desc"),
    treat2Title: t("treat2Title"),
    treat2Desc: t("treat2Desc"),
    treat3Title: t("treat3Title"),
    treat3Desc: t("treat3Desc"),
    treat4Title: t("treat4Title"),
    treat4Desc: t("treat4Desc"),
  });

  // 4. Dynamic After Consultation (3 Services & Features)
  const overview = await getCmsContent("services", "overview", locale, {
    afterConsultTitle: t("afterConsultTitle"),
    afterConsultDesc: t("afterConsultDesc"),
    serviceFeatures: t("serviceFeatures"),
    svc1Title: t("svc1Title"),
    svc1Desc: t("svc1Desc"),
    svc1F1: "",
    svc1F2: "",
    svc1F3: "",
    svc2Title: t("svc2Title"),
    svc2Desc: t("svc2Desc"),
    svc2F1: "",
    svc2F2: "",
    svc2F3: "",
    svc3Title: t("svc3Title"),
    svc3Desc: t("svc3Desc"),
    svc3F1: "",
    svc3F2: "",
    svc3F3: "",
  });

  // 5. Dynamic Infographic Info
  const infoCms = await getCmsContent("services", "infographic", locale, {
    infographicTitle: t("infographicTitle"),
  });

  // 6. Dynamic Final CTA
  const cta = await getCmsContent("services", "cta", locale, {
    ctaTitle: t("ctaTitle"),
    ctaDesc: t("ctaDesc"),
    ctaButton: t("ctaButton"),
  });

  const supabase = await createClient();
  const { data: infoData } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "infographic_image_url")
    .maybeSingle();
  const infographicUrl = infoData?.value || null;

  const defaultWhyItems = t.raw("whyItems") as string[];
  const customWhyItems = [
    consult.whyItem1,
    consult.whyItem2,
    consult.whyItem3,
    consult.whyItem4,
    consult.whyItem5,
    consult.whyItem6,
  ].filter(Boolean) as string[];
  const whyItems = customWhyItems.length > 0 ? customWhyItems : defaultWhyItems;

  const treatCards = [
    { title: treatments.treat1Title || t("treat1Title"), desc: treatments.treat1Desc || t("treat1Desc"), icon: <Sparkles className="w-8 h-8 text-white" /> },
    { title: treatments.treat2Title || t("treat2Title"), desc: treatments.treat2Desc || t("treat2Desc"), icon: <Heart className="w-8 h-8 text-white" /> },
    { title: treatments.treat3Title || t("treat3Title"), desc: treatments.treat3Desc || t("treat3Desc"), icon: <Activity className="w-8 h-8 text-white" /> },
    { title: treatments.treat4Title || t("treat4Title"), desc: treatments.treat4Desc || t("treat4Desc"), icon: <ShieldCheck className="w-8 h-8 text-white" /> },
  ];

  const getSvcFeatures = (index: 1 | 2 | 3, defaultKey: string) => {
    const rawDefaults = (t.raw(defaultKey) as string[]) || [];
    const customList = [
      (overview as any)[`svc${index}F1`],
      (overview as any)[`svc${index}F2`],
      (overview as any)[`svc${index}F3`],
    ].filter(Boolean);
    return customList.length > 0 ? customList : rawDefaults;
  };

  const servicesList = [
    {
      icon: <BookOpen size={28} />,
      title: overview.svc1Title || t("svc1Title"),
      desc: overview.svc1Desc || t("svc1Desc"),
      features: getSvcFeatures(1, "svc1Features"),
      gradient: "from-accent to-accent-dark",
    },
    {
      icon: <Heart size={28} />,
      title: overview.svc2Title || t("svc2Title"),
      desc: overview.svc2Desc || t("svc2Desc"),
      features: getSvcFeatures(2, "svc2Features"),
      gradient: "from-teal-dark to-primary-dark",
    },
    {
      icon: <Star size={28} />,
      title: overview.svc3Title || t("svc3Title"),
      desc: overview.svc3Desc || t("svc3Desc"),
      features: getSvcFeatures(3, "svc3Features"),
      gradient: "from-primary-light to-primary",
    },
  ];

  return (
    <>
      {/* 1. Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 end-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-6 animate-[fade-in_0.6s_ease-out]">
            <Sparkles size={14} className="text-accent" />
            <span>{hero.heroTag}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-bold mb-6 animate-[slide-up_0.6s_ease-out]">{hero.heroTitle}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-[slide-up_0.6s_ease-out_0.15s_both]">{hero.heroDesc}</p>
        </div>
      </section>

      {/* 2. Consultation Card */}
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
                  <h2 className="text-2xl lg:text-4xl font-bold text-text-primary">{consult.consultTitle}</h2>
                  <p className="text-text-secondary leading-relaxed text-lg">{consult.consultDesc}</p>
                  <div className="space-y-4 pt-4">
                    <h3 className="font-semibold text-text-primary">{consult.whyConsult || t("whyConsult")}</h3>
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
                  <h3 className="font-bold text-2xl text-text-primary mb-3">{consult.bookConsult}</h3>
                  <p className="text-sm text-text-secondary mb-8 leading-relaxed">{consult.bookConsultDesc || t("bookConsultDesc")}</p>
                  <Link
                    href="/booking"
                    className="flex flex-col items-center justify-center gap-2 w-full py-4 rounded-xl bg-accent text-white font-bold text-lg hover:bg-accent-light transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-1"
                  >
                    <span className="flex items-center gap-2">{consult.bookNowCTA} <ArrowLeft size={20} className="rtl:rotate-0 ltr:rotate-180" /></span>
                  </Link>
                  <div className="mt-6 flex flex-col gap-2">
                    <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5">
                      <ShieldAlert size={14} className="text-green-500" />
                      {consult.confidential}
                    </p>
                    <p className="text-xs text-text-secondary flex items-center justify-center gap-1.5">
                      <Clock size={14} className="text-primary" />
                      {consult.fastContact || t("fastContact")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. What can be treated (4 Cards) */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-1/2 end-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-4">{treatments.treatTitle || t("treatTitle")}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed text-lg">{treatments.treatDesc || t("treatDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {treatCards.map((item, i) => (
              <div key={i} className="bg-primary text-white rounded-3xl p-8 lg:p-10 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 relative overflow-hidden group border border-white/10 flex flex-col items-center text-center">
                <div className="absolute top-0 start-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10 flex flex-col items-center">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-6 backdrop-blur-md border border-white/20 shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                  <p className="text-gray-100 leading-relaxed text-sm md:text-base font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Services Overview (3 Services - Informative Display) */}
      <section className="py-16 lg:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-3">
              {overview.afterConsultTitle || t("afterConsultTitle")}
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto leading-relaxed text-sm">
              {overview.afterConsultDesc || t("afterConsultDesc")}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servicesList.map((service, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-200/80 p-6 lg:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col text-start"
              >
                <h3 className="text-lg font-bold text-text-primary mb-2 text-start">
                  {service.title}
                </h3>
                <p className="text-xs text-text-secondary leading-relaxed mb-6 text-start">
                  {service.desc}
                </p>
                <div className="pt-2 border-t border-border/40">
                  <h4 className="text-xs font-bold text-text-primary mb-3 text-start">
                    {overview.serviceFeatures || t("serviceFeatures")}
                  </h4>
                  <ul className="space-y-2.5 text-xs text-text-secondary">
                    {service.features.map((f: string, j: number) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-text-secondary leading-snug">
                        <CheckCircle size={15} className="text-primary flex-shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Program Infographic */}
      {infographicUrl && (
        <section className="py-16 lg:py-20 bg-white border-y border-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-text-primary">
                {infoCms.infographicTitle || t("infographicTitle")}
              </h2>
            </div>
            <div className="flex justify-center max-w-2xl mx-auto bg-gray-50/60 p-2 sm:p-4 rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
              <Image 
                src={infographicUrl} 
                alt="البرنامج العلاجي" 
                width={700}
                height={1400}
                className="w-full max-w-[650px] rounded-2xl shadow-md object-contain"
              />
            </div>
          </div>
        </section>
      )}

      {/* 6. Final CTA */}
      <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
        <div className="absolute top-0 start-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 end-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="w-20 h-20 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-primary/20">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-6">{cta.ctaTitle}</h2>
          <p className="text-text-secondary mb-10 max-w-xl mx-auto text-lg leading-relaxed">{cta.ctaDesc}</p>
          <Link
            href="/booking"
            className="inline-flex items-center justify-center gap-3 px-10 py-5 rounded-xl bg-primary text-white font-bold text-xl hover:bg-primary-light transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 group"
          >
            <Phone size={24} className="group-hover:animate-pulse" />
            {cta.ctaButton}
          </Link>
        </div>
      </section>
    </>
  );
}
