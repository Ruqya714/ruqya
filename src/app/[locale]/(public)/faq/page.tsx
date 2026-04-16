import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import FAQContent from "./faq-content";




import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ" });
  return {
    title: t("heroTitle"),
    description: t("heroDesc")
  };
}



export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "FAQ.items" });
  
  const faqs = [
    { id: "1", question: t("q1"), answer: t("a1") },
    { id: "2", question: t("q2"), answer: t("a2") },
    { id: "3", question: t("q3"), answer: t("a3") },
    { id: "4", question: t("q4"), answer: t("a4") }
  ];

  return <FAQContent faqs={faqs as any} />;
}
