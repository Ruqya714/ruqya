import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import ShareArticleButtons from "./ShareArticleButtons";
import { formatDate } from "@/lib/helpers";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const decodedSlug = decodeURIComponent(slug);
  const supabase = createAdminClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", decodedSlug)
    .eq("is_published", true)
    .single();

  if (!article) return { title: "مقال غير موجود" };

  return {
    title: article.title,
    description: article.excerpt || article.title,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string, slug: string }>;
}) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "Blog" });
  const decodedSlug = decodeURIComponent(slug);
  const supabase = createAdminClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*, author:profiles(full_name)")
    .eq("slug", decodedSlug)
    .eq("is_published", true)
    .single();

  if (!article) notFound();

  const categoryLabels: Record<string, string> = {
    article: t("article"),
    healing_story: t("healingStory"),
    announcement: t("announcement"),
  };

  const imgMatch = article.content?.match(/<img[^>]+src="([^">]+)"/);
  const coverImage = article.cover_image || (imgMatch ? imgMatch[1] : null);

  return (
    <article className="py-6 sm:py-8 lg:py-20 bg-gray-50/30">
      {/* Hero Image if exists */}
      {coverImage && (
        <div className="w-full h-[30vh] sm:h-[40vh] md:h-[50vh] lg:h-[60vh] relative mb-6 md:mb-12 bg-gray-900 border-b border-white/10">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <Image src={coverImage} alt={article.title} fill sizes="100vw" priority className="object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-text-secondary hover:text-primary transition-colors mb-6 md:mb-8 bg-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm hover:shadow-md border border-border"
        >
          <ArrowRight size={16} />
          {t("backToArticles") || "{t("backToArticles") || "العودة للمقالات"}"}
        </Link>

        {/* Header */}
        <header className="mb-6 md:mb-10">
          <div className="flex items-center gap-3 mb-3 md:mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Tag size={12} />
              {categoryLabels[article.category] || article.category}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-snug md:leading-tight mb-4 md:mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-6 md:mt-8 pt-5 md:pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-text-secondary bg-white px-3 py-1.5 rounded-lg border border-border shadow-sm">
              <Calendar size={14} className="text-primary" />
              {formatDate(article.published_at || article.created_at, locale)}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-10 shadow-sm border border-border overflow-hidden">
          <div
            className="prose md:prose-lg max-w-none text-text-primary 
              [&_h2]:text-xl md:[&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-8 md:[&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-primary
              [&_h3]:text-lg md:[&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-6 md:[&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-4 [&_p]:leading-relaxed md:[&_p]:leading-loose [&_p]:text-base md:[&_p]:text-lg
              [&_ul]:ps-5 md:[&_ul]:ps-6 [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:text-base md:[&_ul]:text-lg
              [&_ol]:ps-5 md:[&_ol]:ps-6 [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:text-base md:[&_ol]:text-lg
              [&_li]:text-text-secondary
              [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-3 md:[&_blockquote]:p-4 [&_blockquote]:rounded-e-lg [&_blockquote]:italic [&_blockquote]:text-text-secondary [&_blockquote]:my-6 md:[&_blockquote]:my-8 [&_blockquote]:text-sm md:[&_blockquote]:text-base
              [&_a]:text-primary [&_a]:underline
              [&_img]:rounded-lg md:[&_img]:rounded-xl [&_img]:shadow-md [&_img]:mx-auto [&_img]:my-6 md:[&_img]:my-8 [&_img]:border [&_img]:border-border [&_img]:w-full
            "
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </div>

        {/* Share / Related */}
        <div className="mt-8 md:mt-12 pt-6 md:pt-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6 border-t border-border">
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <span className="text-sm font-semibold text-text-primary text-center sm:text-start">{t("shareArticle") || "مشاركة المقال:"}</span>
            <ShareArticleButtons title={article.title} />
          </div>
          
          <Link
            href="/blog"
            className="inline-flex w-full sm:w-auto justify-center items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all shadow-md hover:shadow-lg"
          >
            <ArrowRight size={16} />
            {t("browseMore") || "{t("browseMore") || "تصفح المزيد من المقالات"}"}
          </Link>
        </div>
      </div>
    </article>
  );
}
