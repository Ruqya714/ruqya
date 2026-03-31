"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { createClient } from "@/lib/supabase/client";
import { generateSlug } from "@/lib/helpers";
import { TipTapEditor } from "@/components/ui";
import { Save, ArrowRight, Eye } from "lucide-react";

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const isNew = id === "new";
  const router = useRouter();
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "article",
    is_published: false,
  });

  const loadArticle = useCallback(async () => {
    if (isNew) return;
    const { data } = await supabase.from("articles").select("*").eq("id", id).single();
    if (data) {
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        category: data.category || "article",
        is_published: data.is_published || false,
      });
    }
    setIsLoading(false);
  }, [id, isNew, supabase]);

  useEffect(() => { loadArticle(); }, [loadArticle]);

  const handleTitleChange = (title: string) => {
    setForm({ ...form, title, slug: isNew ? generateSlug(title) : form.slug });
  };

  const handleSave = async (publish = false) => {
    setIsSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const payload = {
        title: form.title,
        slug: form.slug || generateSlug(form.title),
        excerpt: form.excerpt,
        content: form.content,
        category: form.category,
        is_published: publish ? true : form.is_published,
        published_at: publish ? new Date().toISOString() : undefined,
        author_id: user?.id,
      };

      if (isNew) {
        await supabase.from("articles").insert(payload);
      } else {
        await supabase.from("articles").update(payload).eq("id", id);
      }

      router.push("/admin/articles");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center"><div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" /></div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/admin/articles")} className="p-2 rounded-lg hover:bg-gray-100 text-text-secondary transition-colors">
            <ArrowRight size={20} />
          </button>
          <h1 className="text-xl font-bold text-text-primary">{isNew ? "مقال جديد" : "تعديل المقال"}</h1>
        </div>
        <div className="flex items-center gap-2">
          {!form.is_published && (
            <button onClick={() => handleSave(true)} disabled={isSaving || !form.title} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary/5 disabled:opacity-50 transition-all">
              <Eye size={16} /> نشر
            </button>
          )}
          <button onClick={() => handleSave(false)} disabled={isSaving || !form.title} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-light disabled:opacity-50 transition-all">
            {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            حفظ
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <label className="block text-sm font-medium mb-1.5">العنوان *</label>
            <input
              value={form.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="عنوان المقال"
            />
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <label className="block text-sm font-medium mb-1.5">المقتطف</label>
            <textarea
              rows={2}
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-border text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="وصف مختصر للمقال..."
            />
          </div>

          <div className="bg-white rounded-xl border border-border p-5">
            <label className="block text-sm font-medium mb-1.5">المحتوى</label>
            <div className="min-h-[400px]">
              <TipTapEditor
                content={form.content}
                onChange={(html) => setForm({ ...form, content: html })}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-border p-5">
            <h3 className="font-semibold text-text-primary mb-4">إعدادات المقال</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">الرابط (slug)</label>
                <input
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">التصنيف</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  <option value="article">مقال</option>
                  <option value="healing_story">قصة شفاء</option>
                  <option value="announcement">إعلان</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="published"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                  className="accent-primary"
                />
                <label htmlFor="published" className="text-sm">منشور</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
