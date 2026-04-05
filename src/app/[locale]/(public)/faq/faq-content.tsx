"use client";

import { Accordion } from "@/components/ui";
import { Link } from "@/i18n/routing";
import { Phone, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export default function FAQContent({ faqs }: { faqs: FAQ[] }) {
  const t = useTranslations("FAQ");

  const items = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    answer: faq.answer,
  }));

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

      {/* FAQ List */}
      <section className="py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length > 0 ? (
            <Accordion items={items} />
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">{t("noFaq")}</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <MessageCircle size={40} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-text-primary mb-3">{t("ctaTitle")}</h2>
          <p className="text-text-secondary mb-8">{t("ctaDesc")}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-medium hover:bg-primary-light transition-all">
              <MessageCircle size={18} />
              {t("ctaContact")}
            </Link>
            <Link href="/booking" className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-accent text-white font-medium hover:bg-accent-light transition-all">
              <Phone size={18} />
              {t("ctaBook")}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
