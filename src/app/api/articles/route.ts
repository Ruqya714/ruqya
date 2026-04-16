import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getReadingTime } from "@/lib/helpers";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const locale = searchParams.get('locale') || 'ar';
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from("articles")
      .select("id, title, slug, excerpt, content, cover_image, category, published_at, created_at, locale")
      .eq("is_published", true)
      .eq("locale", locale)
      .order("published_at", { ascending: false });

    if (error) {
      console.error("API Articles Error:", error);
      return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }

    const processedArticles = (data || []).map(article => {
      // Extract first image
      const imgMatch = article.content?.match(/<img[^>]+src="([^">]+)"/);
      const cover_image = article.cover_image || (imgMatch ? imgMatch[1] : null);

      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        category: article.category,
        published_at: article.published_at,
        created_at: article.created_at,
        cover_image,
        reading_time: getReadingTime(article.content, locale)
      };
    });

    return NextResponse.json({ articles: processedArticles });
  } catch (error: any) {
    console.error("API Articles Error Exception:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
