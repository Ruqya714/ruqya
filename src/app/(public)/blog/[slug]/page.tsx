import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/helpers";
import { Calendar, ArrowRight, User, Tag } from "lucide-react";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
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
  const supabase = await createClient();

  const { data: article } = await supabase
    .from("articles")
    .select("*, author:profiles(full_name)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!article) notFound();

  const categoryLabels: Record<string, string> = {
    article: "مقال",
    healing_story: "قصة شفاء",
    announcement: "إعلان",
  };

  return (
    <article className="py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors mb-8"
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

          <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
            {article.author?.full_name && (
              <div className="flex items-center gap-2 text-sm text-text-secondary">
                <User size={14} />
                {article.author.full_name}
              </div>
            )}
            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <Calendar size={14} />
              {formatDate(article.published_at || article.created_at)}
            </div>
          </div>
        </header>

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-text-primary leading-relaxed
            [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3
            [&_p]:mb-4 [&_p]:leading-relaxed
            [&_ul]:pr-6 [&_ul]:space-y-2 [&_ul]:mb-4
            [&_ol]:pr-6 [&_ol]:space-y-2 [&_ol]:mb-4
            [&_li]:text-text-secondary
            [&_blockquote]:border-r-4 [&_blockquote]:border-primary [&_blockquote]:pr-4 [&_blockquote]:italic [&_blockquote]:text-text-secondary
            [&_a]:text-primary [&_a]:underline
            [&_img]:rounded-xl [&_img]:shadow-md
          "
          dangerouslySetInnerHTML={{ __html: article.content || "" }}
        />

        {/* Share / Related */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-light font-medium transition-colors"
          >
            <ArrowRight size={16} />
            العودة لجميع المقالات
          </Link>
        </div>
      </div>
    </article>
  );
}
