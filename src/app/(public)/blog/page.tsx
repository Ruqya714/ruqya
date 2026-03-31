import type { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate, truncateText } from "@/lib/helpers";
import { Calendar, ArrowLeft, BookOpen } from "lucide-react";

export const metadata: Metadata = {
  title: "المقالات وقصص الشفاء",
  description: "مقالات في الرقية الشرعية وقصص شفاء بإذن الله من مركز الرقية بكلام الرحمن",
};

export default async function BlogPage() {
  const supabase = await createClient();
  const { data: articles } = await supabase
    .from("articles")
    .select("id, title, slug, excerpt, category, cover_image, published_at, created_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });

  const categoryLabels: Record<string, string> = {
    article: "مقال",
    healing_story: "قصة شفاء",
    announcement: "إعلان",
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
          <div className="absolute top-10 left-20 w-72 h-72 rounded-full bg-accent blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl lg:text-5xl font-bold mb-6">المقالات وقصص الشفاء</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-2xl mx-auto">
            مقالات متخصصة في الرقية الشرعية وقصص شفاء ملهمة بإذن الله
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {!articles || articles.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen size={48} className="text-text-muted mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                لا توجد مقالات حالياً
              </h3>
              <p className="text-text-secondary">
                سيتم إضافة المقالات قريباً بإذن الله
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/blog/${article.slug}`}
                  className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-300"
                >
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <BookOpen
                      size={40}
                      className="text-primary/30 group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  <div className="p-5">
                    {/* Category badge */}
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${
                        categoryColors[article.category] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {categoryLabels[article.category] || article.category}
                    </span>

                    <h3 className="font-semibold text-text-primary mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                        {truncateText(article.excerpt, 120)}
                      </p>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="flex items-center gap-1.5 text-xs text-text-muted">
                        <Calendar size={12} />
                        {formatDate(article.published_at || article.created_at)}
                      </div>
                      <span className="text-xs text-primary font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                        اقرأ المزيد
                        <ArrowLeft size={12} />
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
