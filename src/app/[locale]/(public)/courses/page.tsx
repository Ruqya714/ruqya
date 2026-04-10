"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { 
  GraduationCap, 
  ScrollText, 
  Sparkles, 
  BookOpen, 
  ShieldCheck, 
  Star, 
  AlertTriangle, 
  MessageCircle,
  Gem,
  CheckCircle2
} from "lucide-react";

export default function CoursesPage() {
  const t = useTranslations("Courses");

  const features = [
    { icon: <GraduationCap size={28} />, title: t("feat1Title"), desc: t("feat1Desc"), color: "text-blue-500", bg: "bg-blue-50" },
    { icon: <Sparkles size={28} />, title: t("feat2Title"), desc: t("feat2Desc"), color: "text-emerald-500", bg: "bg-emerald-50" },
    { icon: <ShieldCheck size={28} />, title: t("feat3Title"), desc: t("feat3Desc"), color: "text-amber-500", bg: "bg-amber-50" },
    { icon: <Star size={28} />, title: t("feat4Title"), desc: t("feat4Desc"), color: "text-purple-500", bg: "bg-purple-50" },
    { icon: <ScrollText size={28} />, title: t("feat5Title"), desc: t("feat5Desc"), color: "text-rose-500", bg: "bg-rose-50" },
  ];

  const goldenItems = t.raw("goldenItems") as string[];

  return (
    <>
      <section className="gradient-hero text-white py-16 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-10 end-20 w-96 h-96 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm mb-6 animate-[fade-in_0.6s_ease-out]">
            <BookOpen size={14} className="text-accent" />
            <span>{t("aboutProgram")}</span>
          </div>
          <h1 className="text-3xl lg:text-5xl md:leading-tight font-bold mb-6 animate-[slide-up_0.6s_ease-out]">{t("heroTitle")}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto animate-[slide-up_0.6s_ease-out_0.15s_both]">{t("heroDesc")}</p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-2xl lg:text-4xl font-bold text-text-primary mb-6">{t("aboutProgram")}</h2>
            <p className="text-lg text-text-secondary leading-relaxed">{t("programDesc")}</p>
          </div>

          <div className="mb-20">
            <h3 className="text-xl lg:text-2xl font-bold text-center text-text-primary mb-10">{t("featuresTitle")}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
              {features.map((feat, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                  <div className={`w-14 h-14 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    {feat.icon}
                  </div>
                  <h4 className="text-xl font-bold text-text-primary mb-3">{feat.title}</h4>
                  <p className="text-text-secondary leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative bg-gradient-to-br from-[#1B3B36] to-[#0A1A17] rounded-3xl overflow-hidden shadow-2xl mb-20 text-white">
            <div className="absolute top-0 end-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 start-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
            <div className="relative p-8 lg:p-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] text-sm font-medium mb-6">
                <Gem size={14} />
                {t("goldenFeatureBadge")}
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-4">{t("goldenTitle")}</h3>
              <p className="text-gray-300 text-lg mb-10 max-w-3xl leading-relaxed">{t("goldenDesc")}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {goldenItems.map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 lg:p-5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                    <CheckCircle2 size={24} className="text-[#D4AF37] flex-shrink-0" />
                    <p className="text-gray-200 font-medium leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-s-4 border-amber-500 rounded-xl p-6 mb-16 shadow-sm">
            <div className="flex gap-4">
              <AlertTriangle className="text-amber-500 flex-shrink-0 mt-1" size={28} />
              <div>
                <h4 className="text-amber-800 font-bold text-lg mb-2">{t("notesTitle")}</h4>
                <p className="text-amber-700/90 leading-relaxed font-medium">{t("notesDesc")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50 border-t border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("ctaTitle")}</h2>
          <p className="text-lg text-text-secondary mb-10">{t("ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <Link href={"/contact" as any} className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-white font-bold text-lg hover:bg-primary-light transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
              <MessageCircle size={22} />
              {t("ctaContact")}
            </Link>
          </div>
          <p className="text-sm font-medium text-primary bg-primary/10 inline-block px-6 py-2.5 rounded-full">
            {t("doa")}
          </p>
        </div>
      </section>
    </>
  );
}
