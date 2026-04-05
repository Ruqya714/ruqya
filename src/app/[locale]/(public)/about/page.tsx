"use client";

import {
  Shield,
  Award,
  Users,
  Globe,
  BookOpen,
  Heart,
  CheckCircle,
  Target,
  Eye,
} from "lucide-react";
import { useTranslations } from "next-intl";

export default function AboutPage() {
  const t = useTranslations("About");

  const features = [
    { icon: <Shield size={24} />, titleKey: "feat1Title" as const, descKey: "feat1Desc" as const },
    { icon: <Award size={24} />, titleKey: "feat2Title" as const, descKey: "feat2Desc" as const },
    { icon: <Globe size={24} />, titleKey: "feat3Title" as const, descKey: "feat3Desc" as const },
    { icon: <BookOpen size={24} />, titleKey: "feat4Title" as const, descKey: "feat4Desc" as const },
    { icon: <Heart size={24} />, titleKey: "feat5Title" as const, descKey: "feat5Desc" as const },
    { icon: <Users size={24} />, titleKey: "feat6Title" as const, descKey: "feat6Desc" as const },
  ];

  const teamMembers = [
    { nameKey: "member1Name" as const, roleKey: "member1Role" as const },
    { nameKey: "member2Name" as const, roleKey: "member2Role" as const },
    { nameKey: "member3Name" as const, roleKey: "member3Role" as const },
    { nameKey: "member4Name" as const, roleKey: "member4Role" as const },
  ];

  const values = t.raw("values") as string[];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">{t("heroTitle")}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">{t("heroDesc")}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">{t("storyTag")}</span>
              <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mt-2 mb-6">{t("storyTitle")}</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>{t("storyP1")}</p>
                <p>{t("storyP2")}</p>
                <p>{t("storyP3")}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 lg:p-12 border border-border">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: "2017", labelKey: "statFounded" as const },
                  { value: "+1000", labelKey: "statCases" as const },
                  { value: "+20", labelKey: "statCountries" as const },
                  { value: "+7", labelKey: "statYears" as const },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-text-secondary mt-1">{t(stat.labelKey)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <Eye size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("visionTitle")}</h3>
              <p className="text-gray-100 leading-relaxed">{t("visionDesc")}</p>
            </div>
            <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-8 text-white">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{t("missionTitle")}</h3>
              <p className="text-gray-100 leading-relaxed">{t("missionDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("featuresTitle")}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t("featuresDesc")}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300 group">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">{t(feature.titleKey)}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{t(feature.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-bg">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("teamTitle")}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-border text-center hover:shadow-lg transition-all">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                  <Users size={32} />
                </div>
                <h3 className="font-bold text-lg text-text-primary mb-1">{t(member.nameKey)}</h3>
                <p className="text-sm text-text-secondary">{t(member.roleKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("valuesTitle")}</h2>
          </div>
          <div className="space-y-4">
            {values.map((value: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-lg bg-bg hover:bg-primary/5 transition-colors">
                <CheckCircle size={20} className="text-primary flex-shrink-0 mt-0.5" />
                <p className="text-text-primary">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
