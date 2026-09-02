import FAQContent from "./faq-content";
import { getTranslations } from "next-intl/server";
import JsonLd from "@/components/JsonLd";
import { getFAQSchema } from "@/lib/jsonld";
import { getCmsContent } from "@/lib/cms";
import { fetchFaqsAction } from "@/app/actions/cms";

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const tFaq = await getTranslations({ locale, namespace: "FAQ" });
  const t = await getTranslations({ locale, namespace: "FAQ.items" });

  const hero = await getCmsContent("faq", "hero", locale, {
    heroTitle: tFaq("heroTitle"),
    heroDesc: tFaq("heroDesc"),
    ctaTitle: tFaq("ctaTitle"),
    ctaDesc: tFaq("ctaDesc"),
    ctaContact: tFaq("ctaContact"),
    ctaBook: tFaq("ctaBook"),
  });
  
  const faqsRes = await fetchFaqsAction(locale as "ar" | "tr");
  const dbFaqs = faqsRes.success ? faqsRes.data : [];

  const faqs = (dbFaqs && dbFaqs.length > 0)
    ? dbFaqs
    : [
        { id: "1", question: t("q1"), answer: t("a1") },
        { id: "2", question: t("q2"), answer: t("a2") },
        { id: "3", question: t("q3"), answer: t("a3") },
        { id: "4", question: t("q4"), answer: t("a4") }
      ];

  const faqSchema = getFAQSchema(faqs);

  return (
    <>
      <JsonLd data={faqSchema} />
      <FAQContent 
        faqs={faqs as any} 
        heroTitle={hero.heroTitle} 
        heroDesc={hero.heroDesc}
        ctaTitle={hero.ctaTitle}
        ctaDesc={hero.ctaDesc}
        ctaContact={hero.ctaContact}
        ctaBook={hero.ctaBook}
      />
    </>
  );
}
