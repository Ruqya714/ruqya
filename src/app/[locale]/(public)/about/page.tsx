import {
  Shield,
  Award,
  Users,
  Globe,
  BookOpen,
  Heart,
  Eye,
  Target,
} from "lucide-react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getCmsContent } from "@/lib/cms";
import { fetchHealersI18nAction } from "@/app/actions/cms";

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  // 1. Dynamic Hero
  const hero = await getCmsContent("about", "hero", locale, {
    title: t("heroTitle"),
    description: t("heroDesc"),
  });

  // 2. Dynamic Story & 4 Stats
  const story = await getCmsContent("about", "story", locale, {
    tag: t("storyTag"),
    title: t("storyTitle"),
    p1: t("storyP1"),
    p2: t("storyP2"),
    p3: t("storyP3"),
    stat1Val: "2017",
    stat1Label: t("statFounded"),
    stat2Val: "+1000",
    stat2Label: t("statCases"),
    stat3Val: "+20",
    stat3Label: t("statCountries"),
    stat4Val: "+25",
    stat4Label: t("statYears"),
  });

  // 3. Dynamic Vision & Mission
  const visionMission = await getCmsContent("about", "vision_mission", locale, {
    visionTitle: t("visionTitle"),
    visionDesc: t("visionDesc"),
    missionTitle: t("missionTitle"),
    missionDesc: t("missionDesc"),
  });

  // 4. Dynamic Features (6 cards)
  const featContent = await getCmsContent("about", "features", locale, {
    title: t("featuresTitle"),
    description: t("featuresDesc"),
    feat1Title: t("feat1Title"),
    feat1Desc: t("feat1Desc"),
    feat2Title: t("feat2Title"),
    feat2Desc: t("feat2Desc"),
    feat3Title: t("feat3Title"),
    feat3Desc: t("feat3Desc"),
    feat4Title: t("feat4Title"),
    feat4Desc: t("feat4Desc"),
    feat5Title: t("feat5Title"),
    feat5Desc: t("feat5Desc"),
    feat6Title: t("feat6Title"),
    feat6Desc: t("feat6Desc"),
  });

  const healersRes = await fetchHealersI18nAction(locale as "ar" | "tr");
  const dbHealers = healersRes.success ? healersRes.data : [];

  const featureCards = [
    { icon: <Shield size={24} />, title: featContent.feat1Title || t("feat1Title"), desc: featContent.feat1Desc || t("feat1Desc") },
    { icon: <Award size={24} />, title: featContent.feat2Title || t("feat2Title"), desc: featContent.feat2Desc || t("feat2Desc") },
    { icon: <Globe size={24} />, title: featContent.feat3Title || t("feat3Title"), desc: featContent.feat3Desc || t("feat3Desc") },
    { icon: <BookOpen size={24} />, title: featContent.feat4Title || t("feat4Title"), desc: featContent.feat4Desc || t("feat4Desc") },
    { icon: <Heart size={24} />, title: featContent.feat5Title || t("feat5Title"), desc: featContent.feat5Desc || t("feat5Desc") },
    { icon: <Users size={24} />, title: featContent.feat6Title || t("feat6Title"), desc: featContent.feat6Desc || t("feat6Desc") },
  ];

  const defaultTeamMembers = [
    { name: t("member0Name"), title: t("member0Role"), image: "/الإدارة2.jpeg", zoomClasses: "scale-100" },
    { name: t("member1Name"), title: t("member1Role"), image: "/الراقي سيف الله أبو عامر.png", zoomClasses: "scale-[1.7] origin-top" },
    { name: t("member2Name"), title: t("member2Role"), image: "/الراقي ابو إبراهيم.jpeg", zoomClasses: "scale-150 origin-top" },
    { name: t("member3Name"), title: t("member3Role"), image: "/الراقي ابو إلياس.jpeg", zoomClasses: "scale-125 origin-top" },
    { name: t("member4Name"), title: t("member4Role"), image: "/الراقي ياووز سليم.jpeg", zoomClasses: "scale-[1.6] origin-top" },
    { name: t("member5Name"), title: t("member5Role"), image: "/الكادر الطبي.jpeg", zoomClasses: "scale-100" },
  ];

  const teamMembers = (dbHealers && dbHealers.length > 0)
    ? dbHealers.map((h: any) => ({
        name: h.display_name,
        title: h.title || h.specialization || (locale === "tr" ? "Uzman Terapist" : "معالج معتمد"),
        image: h.photo_url || "/logo.png",
        zoomClasses: "scale-100 object-cover",
      }))
    : defaultTeamMembers;

  const values = t.raw("values") as string[];

  return (
    <>
      {/* Hero */}
      <section className="gradient-hero text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 start-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">{hero.title}</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">{hero.description}</p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-sm font-semibold text-accent uppercase tracking-wider">{story.tag}</span>
              <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mt-2 mb-6">{story.title}</h2>
              <div className="space-y-4 text-text-secondary leading-relaxed">
                <p>{story.p1}</p>
                <p>{story.p2}</p>
                <p>{story.p3}</p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 lg:p-12 border border-border">
              <div className="grid grid-cols-2 gap-6">
                {[
                  { value: story.stat1Val || "2017", label: story.stat1Label || t("statFounded") },
                  { value: story.stat2Val || "+1000", label: story.stat2Label || t("statCases") },
                  { value: story.stat3Val || "+20", label: story.stat3Label || t("statCountries") },
                  { value: story.stat4Val || "+25", label: story.stat4Label || t("statYears") },
                ].map((stat, i) => (
                  <div key={i} className="text-center">
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                    <p className="text-sm text-text-secondary mt-1">{stat.label}</p>
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
              <h3 className="text-xl font-bold mb-4">{visionMission.visionTitle}</h3>
              <p className="text-gray-100 leading-relaxed">{visionMission.visionDesc}</p>
            </div>
            <div className="bg-gradient-to-br from-accent to-accent-dark rounded-2xl p-8 text-white">
              <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mb-6">
                <Target size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4">{visionMission.missionTitle}</h3>
              <p className="text-gray-100 leading-relaxed">{visionMission.missionDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features (6 cards) */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{featContent.title}</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{featContent.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-border hover:shadow-lg transition-all duration-300">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-lg text-text-primary mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-text-primary mb-4">{t("teamTitle")}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {teamMembers.map((member: { name: string; title: string; image: string; zoomClasses?: string }, i: number) => (
              <div key={i} className="bg-bg rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group">
                <div className="h-64 relative bg-gray-100 overflow-hidden flex items-center justify-center">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={`${member.zoomClasses} transition-transform duration-500 group-hover:scale-105`}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="font-semibold text-lg text-text-primary">{member.name}</h3>
                  <p className="text-sm text-primary mt-1 font-medium">{member.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
