import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { Calendar, ArrowRight, Tag } from "lucide-react";
import ShareArticleButtons from "./ShareArticleButtons";
import { formatDate } from "@/lib/helpers";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
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
    article: "مقال",
    healing_story: "قصة شفاء",
    announcement: "إعلان",
  };

  const imgMatch = article.content?.match(/<img[^>]+src="([^">]+)"/);
  const coverImage = article.cover_image || (imgMatch ? imgMatch[1] : null);

  return (
    <article className="py-12 lg:py-20 bg-gray-50/30">
      {/* Hero Image if exists */}
      {coverImage && (
        <div className="w-full h-[40vh] md:h-[50vh] lg:h-[60vh] relative mb-12 bg-gray-900">
          <div className="absolute inset-0 bg-black/40 z-10" />
          <img src={coverImage} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-8 bg-white px-4 py-2 rounded-full shadow-sm hover:shadow-md border border-border"
        >
          <ArrowRight size={16} />
          العودة للمقالات
        </Link>

        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
              <Tag size={12} />
              {categoryLabels[article.category] || article.category}
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold text-text-primary leading-tight mb-6">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="text-lg text-text-secondary leading-relaxed">
              {article.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-8 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-sm text-text-secondary bg-white px-3 py-1.5 rounded-lg border border-border shadow-sm">
              <Calendar size={14} className="text-primary" />
              {formatDate(article.published_at || article.created_at)}
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-border">
          <div
            className="prose prose-lg max-w-none text-text-primary leading-relaxed
              [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:text-primary
              [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-4 [&_p]:leading-loose
              [&_ul]:ps-6 [&_ul]:space-y-2 [&_ul]:mb-6
              [&_ol]:ps-6 [&_ol]:space-y-2 [&_ol]:mb-6
              [&_li]:text-text-secondary
              [&_blockquote]:border-s-4 [&_blockquote]:border-primary [&_blockquote]:bg-primary/5 [&_blockquote]:p-4 [&_blockquote]:rounded-e-lg [&_blockquote]:italic [&_blockquote]:text-text-secondary [&_blockquote]:my-8
              [&_a]:text-primary [&_a]:underline
              [&_img]:rounded-xl [&_img]:shadow-md [&_img]:mx-auto [&_img]:my-8 [&_img]:border [&_img]:border-border
            "
            dangerouslySetInnerHTML={{ __html: article.content || "" }}
          />
        </div>

        {/* Share / Related */}
        <div className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-6 border-t border-border">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-text-primary">مشاركة المقال:</span>
            <ShareArticleButtons title={article.title} />
          </div>
          
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary-light transition-all shadow-md hover:shadow-lg"
          >
            <ArrowRight size={16} />
            تصفح المزيد من المقالات
          </Link>
        </div>
      </div>
    </article>
  );
}
