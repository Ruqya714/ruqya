"use client";

import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Calendar, ArrowLeft, BookOpen, Clock } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";

import { formatDate, truncateText } from "@/lib/helpers";

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  cover_image: string | null;
  published_at: string | null;
  created_at: string;
  reading_time?: string;
}

export default function BlogPage() {
  const t = useTranslations("Blog");
  const locale = useLocale();
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch(`/api/articles?locale=${locale}`);
        const { articles, error } = await response.json();
        
        if (error) throw new Error(error);
        
        setArticles(articles || []);
      } catch (err) {
        console.error("Failed to load articles:", err);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const categoryLabels: Record<string, string> = {
    article: t("article"),
    healing_story: t("healingStory"),
    announcement: t("announcement"),
  };

  const categoryColors: Record<string, string> = {
    article: "bg-primary/10 text-primary",
    healing_story: "bg-accent/10 text-accent-dark",
    announcement: "bg-blue-50 text-blue-700",
  };

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

      {/* Articles Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="py-16 text-center">
              <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            </div>
          ) : !articles || articles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">{t("noArticles")}</h3>
              <p className="text-text-secondary">{t("comingSoon")}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}` as any}
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  <div className="h-48 relative overflow-hidden bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    {article.cover_image ? (
                      <Image src={article.cover_image} alt={article.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <BookOpen size={40} className="text-primary/30 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${categoryColors[article.category] || "bg-gray-100 text-gray-700"}`}>
                      {categoryLabels[article.category] || article.category}
                    </span>
                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                    {article.excerpt && (
                      <p className="text-sm text-text-secondary line-clamp-2 mb-4 flex-1">{truncateText(article.excerpt, 120)}</p>
                    )}
                    <div className="flex flex-col gap-3 pt-4 mt-auto border-t border-border">
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <div className="flex items-center gap-1.5 whitespace-nowrap">
                          <Calendar size={12} />
                          {formatDate(article.published_at || article.created_at, locale)}
                        </div>
                        {article.reading_time && (
                          <div className="flex items-center gap-1.5 whitespace-nowrap">
                            <Clock size={12} />
                            {article.reading_time}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-primary font-medium flex items-center justify-end gap-1 group-hover:gap-2 transition-all">
                        {t("readMore")}
                        <ArrowLeft size={12} className="rtl:rotate-0 ltr:rotate-180" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
